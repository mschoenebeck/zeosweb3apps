#include "zeosweb3apps.hpp"
#include "liquidstorage_uri.hpp"


zeosweb3apps::zeosweb3apps(name self, name code, datastream<const char *> ds) :
    contract(self, code, ds)
{
}

void zeosweb3apps::setstoragecfg(const uint64_t &max_file_size_in_bytes,
                                 const uint64_t &global_upload_limit_per_day,
                                 const uint64_t &vaccount_upload_limit_per_day)
{
    require_auth(get_self());
    storagecfg_t storagecfg_table(get_self(), get_self().value);
    auto storagecfg = storagecfg_table.get_or_default();

    storagecfg.max_file_size_in_bytes = max_file_size_in_bytes;
    storagecfg.global_upload_limit_per_day = global_upload_limit_per_day;
    storagecfg.vaccount_upload_limit_per_day = vaccount_upload_limit_per_day;

    storagecfg_table.set(storagecfg, get_self());
}

void zeosweb3apps::setdns(const name& user, const checksum256& ipfs_hash)
{
    require_auth(user);
    
    dns_t dns_table(get_self(), get_self().value);
    auto c = dns_table.find(user.value);
    
    if(c == dns_table.end())
    {
        // add new entry
        dns_table.emplace(user, [&](auto& row){
            row.user = user;
            row.ipfs_hash = ipfs_hash;
        });
    }
    else
    {
        // update existing hash
        dns_table.modify(c, user, [&](auto& row){
            row.ipfs_hash = ipfs_hash;
        });
    }
}
