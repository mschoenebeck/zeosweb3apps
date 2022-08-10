#pragma once

#define USE_ADVANCED_IPFS
#include <eosio/eosio.hpp>
#include <eosio/singleton.hpp>
#include "../dappservices/ipfs.hpp"

using namespace eosio;
using namespace std;

#define DAPPSERVICES_ACTIONS() \
    XSIGNAL_DAPPSERVICE_ACTION \
    IPFS_DAPPSERVICE_ACTIONS 

#define DAPPSERVICE_ACTIONS_COMMANDS() \
    IPFS_SVC_COMMANDS() 

#define CONTRACT_NAME() zeosweb3apps

CONTRACT_START()
    
    // LiquidStorage Config Table
    TABLE storagecfg
    {
        // all measurements in bytes
        uint64_t max_file_size_in_bytes = UINT64_MAX; // max file size in bytes that can be uploaded at a time, default 10mb
        uint64_t global_upload_limit_per_day = UINT64_MAX; // max upload limit in bytes per day for EOS account, default 1 GB
        uint64_t vaccount_upload_limit_per_day = UINT64_MAX; // max upload limit in bytes per day for LiquidAccounts, default 10 MB
    };
    typedef eosio::singleton<"storagecfg"_n, storagecfg> storagecfg_t;

    TABLE dns
    {
        name user;
        checksum256 ipfs_hash;

        uint64_t primary_key() const { return user.value; }
    };
    typedef eosio::multi_index<"dns"_n, dns> dns_t;

    public:

    // constructor
    zeosweb3apps(name self, name code, datastream<const char *> ds);

    // SET PARAMS FOR storagecfg TABLE //
    ACTION setstoragecfg(const uint64_t &max_file_size_in_bytes,
                         const uint64_t &global_upload_limit_per_day,
                         const uint64_t &vaccount_upload_limit_per_day);

    // set dns entry
    ACTION setdns(const name& user, const checksum256& ipfs_hash);

CONTRACT_END((setstoragecfg)(setdns)(xdcommit))
