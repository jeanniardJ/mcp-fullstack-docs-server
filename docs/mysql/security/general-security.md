# General Security Issues

> **Source:** [Documentation officielle MySQL](https://dev.mysql.com/doc/refman/8.0/en/security.html)  
> **Type:** Documentation MySQL 8.0 officielle  
> **Version:** MySQL 8.0

---

**Table of Contents**
[8.1 General Security Issues](general-security-issues.html)[8.1.1 Security Guidelines](security-guidelines.html)[8.1.2 Keeping Passwords Secure](password-security.html)[8.1.3 Making MySQL Secure Against Attackers](security-against-attack.html)[8.1.4 Security-Related mysqld Options and Variables](security-options.html)[8.1.5 How to Run MySQL as a Normal User](changing-mysql-user.html)[8.1.6 Security Considerations for LOAD DATA LOCAL](load-data-local-security.html)[8.1.7 Client Programming Security Guidelines](secure-client-programming.html)[8.2 Access Control and Account Management](access-control.html)[8.2.1 Account User Names and Passwords](user-names.html)[8.2.2 Privileges Provided by MySQL](privileges-provided.html)[8.2.3 Grant Tables](grant-tables.html)[8.2.4 Specifying Account Names](account-names.html)[8.2.5 Specifying Role Names](role-names.html)[8.2.6 Access Control, Stage 1: Connection Verification](connection-access.html)[8.2.7 Access Control, Stage 2: Request Verification](request-access.html)[8.2.8 Adding Accounts, Assigning Privileges, and Dropping Accounts](creating-accounts.html)[8.2.9 Reserved Accounts](reserved-accounts.html)[8.2.10 Using Roles](roles.html)[8.2.11 Account Categories](account-categories.html)[8.2.12 Privilege Restriction Using Partial Revokes](partial-revokes.html)[8.2.13 When Privilege Changes Take Effect](privilege-changes.html)[8.2.14 Assigning Account Passwords](assigning-passwords.html)[8.2.15 Password Management](password-management.html)[8.2.16 Server Handling of Expired Passwords](expired-password-handling.html)[8.2.17 Pluggable Authentication](pluggable-authentication.html)[8.2.18 Multifactor Authentication](multifactor-authentication.html)[8.2.19 Proxy Users](proxy-users.html)[8.2.20 Account Locking](account-locking.html)[8.2.21 Setting Account Resource Limits](user-resources.html)[8.2.22 Troubleshooting Problems Connecting to MySQL](problems-connecting.html)[8.2.23 SQL-Based Account Activity Auditing](account-activity-auditing.html)[8.3 Using Encrypted Connections](encrypted-connections.html)[8.3.1 Configuring MySQL to Use Encrypted Connections](using-encrypted-connections.html)[8.3.2 Encrypted Connection TLS Protocols and Ciphers](encrypted-connection-protocols-ciphers.html)[8.3.3 Creating SSL and RSA Certificates and Keys](creating-ssl-rsa-files.html)[8.3.4 Connecting to MySQL Remotely from Windows with SSH](windows-and-ssh.html)[8.3.5 Reusing SSL Sessions](reusing-ssl-sessions.html)[8.4 Security Components and Plugins](security-plugins.html)[8.4.1 Authentication Plugins](authentication-plugins.html)[8.4.2 Connection Control Plugins](connection-control-plugin.html)[8.4.3 The Password Validation Component](validate-password.html)[8.4.4 The MySQL Keyring](keyring.html)[8.4.5 MySQL Enterprise Audit](audit-log.html)[8.4.6 The Audit Message Component](audit-api-message-emit.html)[8.4.7 MySQL Enterprise Firewall](firewall.html)[8.5 MySQL Enterprise Data Masking and De-Identification](data-masking.html)[8.5.1 Data-Masking Components Versus the Data-Masking Plugin](data-masking-components-vs-plugin.html)[8.5.2 MySQL Enterprise Data Masking and De-Identification Components](data-masking-components.html)[8.5.3 MySQL Enterprise Data Masking and De-Identification Plugin](data-masking-plugin.html)[8.6 MySQL Enterprise Encryption](enterprise-encryption.html)[8.6.1 MySQL Enterprise Encryption Installation and Upgrading](enterprise-encryption-installation.html)[8.6.2 Configuring MySQL Enterprise Encryption](enterprise-encryption-configuring.html)[8.6.3 MySQL Enterprise Encryption Usage and Examples](enterprise-encryption-usage.html)[8.6.4 MySQL Enterprise Encryption Function Reference](enterprise-encryption-function-reference.html)[8.6.5 MySQL Enterprise Encryption Component Function Descriptions](enterprise-encryption-functions.html)[8.6.6 MySQL Enterprise Encryption Legacy Function Descriptions](enterprise-encryption-functions-legacy.html)[8.7 SELinux](selinux.html)[8.7.1 Check if SELinux is Enabled](selinux-checking.html)[8.7.2 Changing the SELinux Mode](selinux-mode.html)[8.7.3 MySQL Server SELinux Policies](selinux-policies.html)[8.7.4 SELinux File Context](selinux-file-context.html)[8.7.5 SELinux TCP Port Context](selinux-context-tcp-port.html)[8.7.6 Troubleshooting SELinux](selinux-troubleshooting.html)[8.8 FIPS Support](fips-mode.html)
When thinking about security within a MySQL installation, you should
consider a wide range of possible topics and how they affect the
security of your MySQL server and related applications:
General factors that affect security. These include choosing
good passwords, not granting unnecessary privileges to users,
ensuring application security by preventing SQL injections and
data corruption, and others. See
[Section 8.1, “General Security Issues”](general-security-issues.html).
Security of the installation itself. The data files, log files,
and the all the application files of your installation should be
protected to ensure that they are not readable or writable by
unauthorized parties. For more information, see
[Section 2.9, “Postinstallation Setup and Testing”](postinstallation.html).
Access control and security within the database system itself,
including the users and databases granted with access to the
databases, views and stored programs in use within the database.
For more information, see [Section 8.2, “Access Control and Account Management”](access-control.html).
The features offered by security-related plugins. See
[Section 8.4, “Security Components and Plugins”](security-plugins.html).
Network security of MySQL and your system. The security is
related to the grants for individual users, but you may also
wish to restrict MySQL so that it is available only locally on
the MySQL server host, or to a limited set of other hosts.
Ensure that you have adequate and appropriate backups of your
database files, configuration and log files. Also be sure that
you have a recovery solution in place and test that you are able
to successfully recover the information from your backups. See
[Chapter 9, *Backup and Recovery*](backup-and-recovery.html).
Note
Several topics in this chapter are also addressed in the
Secure
Deployment Guide, which provides procedures for deploying
a generic binary distribution of MySQL Enterprise Edition Server with features for
managing the security of your MySQL installation.
PREV  
[ HOME](index.html)  
[ UP](index.html)  
NEXT 
Related Documentation
[MySQL 8.0 Release Notes](/doc/relnotes/mysql/8.0/en/)
[MySQL 8.0 Source Code Documentation](/doc/dev/mysql-server/latest/)
Download
this Manual
[PDF (US Ltr)](https://downloads.mysql.com/docs/refman-8.0-en.pdf)
- 43.3Mb
[PDF (A4)](https://downloads.mysql.com/docs/refman-8.0-en.a4.pdf)
- 43.4Mb
[Man Pages (TGZ)](https://downloads.mysql.com/docs/refman-8.0-en.man-gpl.tar.gz)
- 297.2Kb
[Man Pages (Zip)](https://downloads.mysql.com/docs/refman-8.0-en.man-gpl.zip)
- 402.4Kb
[Info (Gzip)](https://downloads.mysql.com/docs/mysql-8.0.info.gz)
- 4.3Mb
[Info (Zip)](https://downloads.mysql.com/docs/mysql-8.0.info.zip)
- 4.3Mb
Excerpts from this Manual
[MySQL Backup and Recovery](/doc/mysql-backup-excerpt/8.0/en/)
[MySQL Globalization](/doc/mysql-g11n-excerpt/8.0/en/)
[MySQL Information Schema](/doc/mysql-infoschema-excerpt/8.0/en/)
[MySQL Installation Guide](/doc/mysql-installation-excerpt/8.0/en/)
[Security in MySQL](/doc/mysql-security-excerpt/8.0/en/)
[Starting and Stopping MySQL](/doc/mysql-startstop-excerpt/8.0/en/)
[MySQL and Linux/Unix](/doc/mysql-linuxunix-excerpt/8.0/en/)
[MySQL and Windows](/doc/mysql-windows-excerpt/8.0/en/)
[MySQL and macOS](/doc/mysql-macos-excerpt/8.0/en/)
[MySQL and Solaris](/doc/mysql-solaris-excerpt/8.0/en/)
[Building MySQL from Source](/doc/mysql-sourcebuild-excerpt/8.0/en/)
[MySQL Restrictions and Limitations](/doc/mysql-reslimits-excerpt/8.0/en/)
[MySQL Partitioning](/doc/mysql-partitioning-excerpt/8.0/en/)
[MySQL Tutorial](/doc/mysql-tutorial-excerpt/8.0/en/)
[MySQL Performance Schema](/doc/mysql-perfschema-excerpt/8.0/en/)
[MySQL Replication](/doc/mysql-replication-excerpt/8.0/en/)
[Using the MySQL Yum Repository](/doc/mysql-repo-excerpt/8.0/en/)
[MySQL NDB Cluster 8.0](/doc/mysql-cluster-excerpt/8.0/en/)

---

## 📚 Documentation officielle

Cette page provient de la documentation officielle MySQL :
- **URL source:** https://dev.mysql.com/doc/refman/8.0/en/security.html
- **Site officiel:** [dev.mysql.com](https://dev.mysql.com/doc/)
- **Téléchargé le:** 27/06/2025

---
