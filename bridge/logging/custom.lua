if GetLoggingMethod() ~= 'custom' then return end

---log an action to an external service
---@param level 'info'|'error'|'success'
---@param action 'deposit_funds'|'withdraw_funds'|'transfer'
---@param title string
---@param fields table<string|any> | nil
---@param source string | nil Player originating the the action
---@param target string | nil Player receiving the action
function Log(level, action, title, fields, source, target)
    -- Example code that can be reused
    -- if level ~= 'info' and level ~= 'error' and level ~= 'success' then
    --     warn(('Invalid "level" parameter (%s) passed to Log function, defaulting to info.'):format(level))
    --     level = 'info'
    -- end

    -- if (not fields and target) then
    --     local identifiers = {
    --         discord = GetPlayerIdentifierByType(target, 'discord'),
    --         fivem = GetPlayerIdentifierByType(target, 'fivem'),
    --         license = GetPlayerIdentifierByType(target, 'license')
    --     }

    --     local identifiersString = ""
    --     for idType, id in pairs(identifiers) do
    --         if id then
    --             identifiersString = identifiersString .. string.format("%s: %s, ", idType, id)
    --         end
    --     end

    --     if (not fields) then
    --         fields = {}
    --     end

    --     fields.target_svid = target
    --     fields.target_name = GetPlayerName(target) or 'unknown'
    --     fields.target_identifiers = identifiersString ~= "" and identifiersString or 'no identifiers'
    -- end

    error('No logging implemented !\n- Please add your own code to log the action.')
end
