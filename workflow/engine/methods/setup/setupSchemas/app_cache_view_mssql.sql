CREATE TABLE APP_CACHE_VIEW
(
    APP_UID VARCHAR(32) default '' NOT NULL,
    DEL_INDEX INTEGER default 0 NOT NULL,
    APP_NUMBER INTEGER default 0 NOT NULL,
    APP_STATUS VARCHAR(32) default '' NOT NULL,
    USR_UID VARCHAR(32) default '' NOT NULL,
    PREVIOUS_USR_UID VARCHAR(32) default '' NOT NULL,
    TAS_UID VARCHAR(32) default '' NOT NULL,
    PRO_UID VARCHAR(32) default '' NOT NULL,
    DEL_DELEGATE_DATE VARCHAR(10) default '' NOT NULL,
    DEL_INIT_DATE DATETIME,
    DEL_TASK_DUE_DATE DATETIME,
    DEL_FINISH_DATE DATETIME,
    DEL_THREAD_STATUS VARCHAR(32) default 'OPEN' NOT NULL,
    APP_THREAD_STATUS VARCHAR(32) default 'OPEN' NOT NULL,
    APP_TITLE VARCHAR(255) default '' NOT NULL,
    APP_PRO_TITLE VARCHAR(255) default '' NOT NULL,
    APP_TAS_TITLE VARCHAR(255) default '' NOT NULL,
    APP_CURRENT_USER VARCHAR(128) default '' NOT NULL,
    APP_DEL_PREVIOUS_USER VARCHAR(128) default '' NOT NULL,
    DEL_PRIORITY VARCHAR(32) default '3' NOT NULL,
    DEL_DURATION BIGINT default 0,
    DEL_QUEUE_DURATION BIGINT default 0,
    DEL_DELAY_DURATION BIGINT default 0,
    DEL_STARTED TINYINT default 0,
    DEL_FINISHED TINYINT default 0,
    DEL_DELAYED TINYINT default 0,
    APP_CREATE_DATE DATETIME  NOT NULL,
    APP_FINISH_DATE DATETIME  NULL,
    APP_UPDATE_DATE DATETIME  NOT NULL,
    APP_OVERDUE_PERCENTAGE BIGINT NOT NULL default 0,
    APP_LAST_USER VARCHAR(128) default '' NOT NULL,
    PRIMARY KEY (APP_UID,DEL_INDEX),
    UNIQUE (APP_NUMBER),
    UNIQUE (USR_UID, APP_STATUS)
)