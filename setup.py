from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in interview/__init__.py
from interview import __version__ as version

setup(
	name="interview",
	version=version,
	description="fhm",
	author="admin",
	author_email="admin@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
