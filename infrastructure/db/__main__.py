"""Parlez persistent Postgres EC2 instance — created once, stopped/started via AWS CLI, never destroyed."""

import pulumi
import pulumi_aws as aws

default_vpc = aws.ec2.get_vpc(default=True)
default_subnets = aws.ec2.get_subnets(filters=[
    {"name": "vpc-id", "values": [default_vpc.id]},
    {"name": "availability-zone", "values": ["us-east-1a"]},
])

# Security group — SSH open, Postgres restricted to this VPC only (never the public internet).
sg = aws.ec2.SecurityGroup("parlez-db-ec2-sg",
    vpc_id=default_vpc.id,
    ingress=[
        {
            "protocol": "tcp",
            "from_port": 22,
            "to_port": 22,
            "cidr_blocks": ["0.0.0.0/0"],
        },
        {
            "protocol": "tcp",
            "from_port": 5432,
            "to_port": 5432,
            "cidr_blocks": [default_vpc.cidr_block],
        },
    ],
    egress=[{
        "protocol": "-1",
        "from_port": 0,
        "to_port": 0,
        "cidr_blocks": ["0.0.0.0/0"],
    }],
)

# IAM role + instance profile — SSM access for troubleshooting.
assume_role_policy = aws.iam.get_policy_document(statements=[{
    "actions": ["sts:AssumeRole"],
    "principals": [{
        "type": "Service",
        "identifiers": ["ec2.amazonaws.com"],
    }],
}])

role = aws.iam.Role("parlez-db-role",
    assume_role_policy=assume_role_policy.json,
)

aws.iam.RolePolicyAttachment("parlez-db-ssm",
    role=role.name,
    policy_arn="arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
)

instance_profile = aws.iam.InstanceProfile("parlez-db-profile",
    role=role.name,
)

# Independent key pair — same SSH key content as the e2e project, but its own
# AWS resource, so destroying the e2e stack never affects access here.
with open("parlez-e2e.pub") as f:
    public_key = f.read().strip()

key_pair = aws.ec2.KeyPair("parlez-db-key",
    key_name="parlez-db",
    public_key=public_key,
)

ami = aws.ssm.get_parameter(
    name="/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64",
)

instance = aws.ec2.Instance("parlez-db",
    instance_type="t4g.micro",
    ami=ami.value,
    subnet_id=default_subnets.ids[0],
    vpc_security_group_ids=[sg.id],
    iam_instance_profile=instance_profile.name,
    key_name=key_pair.key_name,
    associate_public_ip_address=True,
    root_block_device={
        "volume_size": 20,
        "volume_type": "gp3",
    },
    user_data="""#!/bin/bash
dnf install -y postgresql16-server
postgresql-setup --initdb
systemctl enable --now postgresql
""",
    tags={"Name": "parlez-db"},
)

pulumi.export("instance_id", instance.id)
pulumi.export("public_ip", instance.public_ip)
pulumi.export("security_group_id", sg.id)