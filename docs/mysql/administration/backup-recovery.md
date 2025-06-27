# Backup and Recovery

> **Source:** [Documentation officielle MySQL](https://dev.mysql.com/doc/refman/8.0/en/backup-and-recovery.html)  
> **Type:** Documentation MySQL 8.0 officielle  
> **Version:** MySQL 8.0

---

**Table of Contents**
[9.1 Backup and Recovery Types](backup-types.html)[9.2 Database Backup Methods](backup-methods.html)[9.3 Example Backup and Recovery Strategy](backup-strategy-example.html)[9.3.1 Establishing a Backup Policy](backup-policy.html)[9.3.2 Using Backups for Recovery](recovery-from-backups.html)[9.3.3 Backup Strategy Summary](backup-strategy-summary.html)[9.4 Using mysqldump for Backups](using-mysqldump.html)[9.4.1 Dumping Data in SQL Format with mysqldump](mysqldump-sql-format.html)[9.4.2 Reloading SQL-Format Backups](reloading-sql-format-dumps.html)[9.4.3 Dumping Data in Delimited-Text Format with mysqldump](mysqldump-delimited-text.html)[9.4.4 Reloading Delimited-Text Format Backups](reloading-delimited-text-dumps.html)[9.4.5 mysqldump Tips](mysqldump-tips.html)[9.5 Point-in-Time (Incremental) Recovery](point-in-time-recovery.html)[9.5.1 Point-in-Time Recovery Using Binary Log](point-in-time-recovery-binlog.html)[9.5.2 Point-in-Time Recovery Using Event Positions](point-in-time-recovery-positions.html)[9.6 MyISAM Table Maintenance and Crash Recovery](myisam-table-maintenance.html)[9.6.1 Using myisamchk for Crash Recovery](myisam-crash-recovery.html)[9.6.2 How to Check MyISAM Tables for Errors](myisam-check.html)[9.6.3 How to Repair MyISAM Tables](myisam-repair.html)[9.6.4 MyISAM Table Optimization](myisam-optimization.html)[9.6.5 Setting Up a MyISAM Table Maintenance Schedule](myisam-maintenance-schedule.html)
It is important to back up your databases so that you can recover
your data and be up and running again in case problems occur, such
as system crashes, hardware failures, or users deleting data by
mistake. Backups are also essential as a safeguard before upgrading
a MySQL installation, and they can be used to transfer a MySQL
installation to another system or to set up replica servers.
MySQL offers a variety of backup strategies from which you can
choose the methods that best suit the requirements for your
installation. This chapter discusses several backup and recovery
topics with which you should be familiar:
Types of backups: Logical versus physical, full versus
incremental, and so forth.
Methods for creating backups.
Recovery methods, including point-in-time recovery.
Backup scheduling, compression, and encryption.
Table maintenance, to enable recovery of corrupt tables.
## Additional Resources
Resources related to backup or to maintaining data availability
include the following:
Customers of MySQL Enterprise Edition can use the MySQL Enterprise Backup product for backups. For an
overview of the MySQL Enterprise Backup product, see
[Section 32.1, “MySQL Enterprise Backup Overview”](mysql-enterprise-backup.html).
A forum dedicated to backup issues is available at
[https://forums.mysql.com/list.php?28](https://forums.mysql.com/list.php?28).
Details for [**mysqldump**](mysqldump.html) can be found in
[Chapter 6, *MySQL Programs*](programs.html).
The syntax of the SQL statements described here is given in
[Chapter 15, *SQL Statements*](sql-statements.html).
For additional information about `InnoDB`
backup procedures, see [Section 17.18.1, “InnoDB Backup”](innodb-backup.html).
Replication enables you to maintain identical data on multiple
servers. This has several benefits, such as enabling client
query load to be distributed over servers, availability of data
even if a given server is taken offline or fails, and the
ability to make backups with no impact on the source by using a
replica. See [Chapter 19, *Replication*](replication.html).
MySQL InnoDB Cluster is a collection of products that work
together to provide a high availability solution. A group of
MySQL servers can be configured to create a cluster using
MySQL Shell. The cluster of servers has a single source, called
the primary, which acts as the read-write source. Multiple
secondary servers are replicas of the source. A minimum of three
servers are required to create a high availability cluster. A
client application is connected to the primary via MySQL Router. If
the primary fails, a secondary is automatically promoted to the
role of primary, and MySQL Router routes requests to the new
primary.
NDB Cluster provides a high-availability, high-redundancy
version of MySQL adapted for the distributed computing
environment. See [Chapter 25, *MySQL NDB Cluster 8.0*](mysql-cluster.html), which provides
information about MySQL NDB Cluster 8.0.
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
- **URL source:** https://dev.mysql.com/doc/refman/8.0/en/backup-and-recovery.html
- **Site officiel:** [dev.mysql.com](https://dev.mysql.com/doc/)
- **Téléchargé le:** 27/06/2025

---
