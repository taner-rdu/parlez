"""Parlez on-demand EC2 instance — created and destroyed via GitHub Actions."""

import pulumi
import pulumi_aws as aws

# 1. Default VPC — already has an internet gateway and public subnets,
# and is completely separate from the RDS stack's VPC.
default_vpc = aws.ec2.get_vpc(default=True)
default_subnets = aws.ec2.get_subnets(filters=[
    {"name": "vpc-id", "values": [default_vpc.id]},
    {"name": "availability-zone", "values": ["us-east-1a"]},
])

# 2. Security group — allow inbound 8000 (API, later), all outbound.
sg = aws.ec2.SecurityGroup("parlez-e2e-sg",
    vpc_id=default_vpc.id,
    ingress=[{
        "protocol": "tcp",
        "from_port": 8000,
        "to_port": 8000,
        "cidr_blocks": ["0.0.0.0/0"],
    },
        {
            "protocol": "tcp",
            "from_port": 22,
            "to_port": 22,
            "cidr_blocks": ["0.0.0.0/0"],
        },
    ],
    egress=[{
        "protocol": "-1",
        "from_port": 0,
        "to_port": 0,
        "cidr_blocks": ["0.0.0.0/0"],
    }],
)

# 3. IAM role + instance profile — SSM Session Manager access.
assume_role_policy = aws.iam.get_policy_document(statements=[{
    "actions": ["sts:AssumeRole"],
    "principals": [{
        "type": "Service",
        "identifiers": ["ec2.amazonaws.com"],
    }],
}])

role = aws.iam.Role("parlez-e2e-role",
    assume_role_policy=assume_role_policy.json,
)

aws.iam.RolePolicyAttachment("parlez-e2e-ssm",
    role=role.name,
    policy_arn="arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
)

instance_profile = aws.iam.InstanceProfile("parlez-e2e-profile",
    role=role.name,
)

# 4. Latest Amazon Linux 2023 arm64 AMI, looked up dynamically.
ami = aws.ssm.get_parameter(
    name="/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64",
)

# Register our SSH public key with AWS so Ansible can authenticate.
with open("parlez-e2e.pub") as f:
    public_key = f.read().strip()

key_pair = aws.ec2.KeyPair("parlez-e2e-key",
    key_name="parlez-e2e",
    public_key=public_key,
)

# 5. The instance — cheapest general-purpose size, Docker-ready via user_data.
instance = aws.ec2.Instance("parlez-e2e",
    instance_type="t4g.micro",
    ami=ami.value,
    subnet_id=default_subnets.ids[0],
    vpc_security_group_ids=[sg.id],
    iam_instance_profile=instance_profile.name,
    key_name=key_pair.key_name,
    associate_public_ip_address=True,
    root_block_device={
        "volume_size": 8,
        "volume_type": "gp3",
    },
    user_data="""#!/bin/bash
dnf install -y docker
systemctl enable --now docker
""",
    tags={"Name": "parlez-e2e"},
)

# 6. Outputs — printed by the GitHub Actions workflow after `pulumi up`.
pulumi.export("instance_id", instance.id)
pulumi.export("public_ip", instance.public_ip)
pulumi.export("security_group_id", sg.id)