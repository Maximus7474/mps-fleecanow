if (not IsFrameworkStarted("qbx")) then return end

---Get the player's current bank account balance
---@param src number
---@return integer
function GetBankBalance(src)
    local qPlayer = exports.qbx_core:GetPlayer(tonumber(src))

    if not qPlayer then
        return 0
    end

    return qPlayer.Functions.GetMoney("bank") or 0
end

---Remove money from a player's bank account
---@param src number
---@param amount number
---@return boolean success
function RemoveMoney(src, amount)
    local qPlayer = exports.qbx_core:GetPlayer(tonumber(src))

    if not qPlayer then
        return false
    end

    local balance = GetBankBalance(src)

    if (balance < amount) then
        return false
    end

    local result = qPlayer.Functions.RemoveMoney("bank", amount, Locale("REMOVED_MONEY"))

    print('RemoveMoney qbox result', result or 'nil')

    return true
end

---Add money to a player's bank account
---@param src number
---@param amount number
---@return boolean success
function AddMoney(src, amount)
    local qPlayer = exports.qbx_core:GetPlayer(tonumber(src))

    if not qPlayer or amount < 0 then
        return false
    end

    qPlayer.Functions.AddMoney("bank", amount, Locale("ADDED_MONEY"))

    return true
end

exports('GetBankBalance', GetBankBalance)
exports('RemoveMoney', RemoveMoney)
exports('AddMoney', AddMoney)

print('Registered qbox bridge')
