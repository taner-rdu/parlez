"""Parlez AWS Infrastructure"""

import json
import pulumi
import pulumi_aws as aws
from pulumi_random import RandomPassword

# Generate DB password — app reads this from Secrets Manager, never hardcoded
db_password = RandomPassword("parlez-db-password",
    length=16,
    special=False,
)

# VPC
vpc = aws.ec2.Vpc("parlez-vpc",
    cidr_block="10.0.0.0/16",
    enable_dns_hostnames=True,
    enable_dns_support=True,
)

# Subnets
subnet_a = aws.ec2.Subnet("parlez-subnet-a",
    vpc_id=vpc.id,
    cidr_block="10.0.1.0/24",
    availability_zone="us-east-1a",
)

subnet_b = aws.ec2.Subnet("parlez-subnet-b",
    vpc_id=vpc.id,
    cidr_block="10.0.2.0/24",
    availability_zone="us-east-1b",
)

# DB Subnet Group
db_subnet_group = aws.rds.SubnetGroup("parlez-db-subnet",
    subnet_ids=[subnet_a.id, subnet_b.id],
)

# Security Group
db_sg = aws.ec2.SecurityGroup("parlez-db-sg",
    vpc_id=vpc.id,
    ingress=[{
        "protocol": "tcp",
        "from_port": 5432,
        "to_port": 5432,
        "cidr_blocks": ["10.0.0.0/16"],
    }],
    egress=[{
        "protocol": "-1",
        "from_port": 0,
        "to_port": 0,
        "cidr_blocks": ["0.0.0.0/0"],
    }],
)

# RDS PostgreSQL
db = aws.rds.Instance("parlez-db",
    identifier="parlez-db",
    engine="postgres",
    engine_version="16",
    instance_class="db.t3.micro",
    allocated_storage=20,
    db_name="parlez",
    username="parlez_admin",
    password=db_password.result,
    db_subnet_group_name=db_subnet_group.name,
    vpc_security_group_ids=[db_sg.id],
    skip_final_snapshot=True,
    publicly_accessible=False,
    opts=pulumi.ResourceOptions(replace_on_changes=["identifier"]),
)

# Store credentials in Secrets Manager
secret = aws.secretsmanager.Secret("parlez-db-secret",
    name="parlez/db",
)

aws.secretsmanager.SecretVersion("parlez-db-secret-version",
    secret_id=secret.id,
    secret_string=pulumi.Output.all(
        host=db.address,
        password=db_password.result,
    ).apply(lambda args: json.dumps({
        "DB_HOST": args["host"],
        "DB_USER": "parlez_admin",
        "DB_PASSWORD": args["password"],
        "DB_NAME": "parlez",
    })),
)

pulumi.export("db_endpoint", db.endpoint)
pulumi.export("db_name", db.db_name)
pulumi.export("vpc_id", vpc.id)