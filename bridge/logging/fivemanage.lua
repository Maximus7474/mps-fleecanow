if GetLoggingMethod() ~= 'fivemanage' then return end

local resourceName = 'fmsdk'
local canLog = GetResourceState(resourceName) == "started" or GetResourceState(resourceName) == "starting"

        --  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
        -- ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
        -- ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
        -- ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
        -- ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
        --  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 

-- Fivemanage API config, refer to their documentation for more details
-- https://github.com/fivemanage/sdk?tab=readme-ov-file#working-with-logs

local dataset = "default"

---log an action to an external service
---@param level 'info' | 'error' | 'success'
---@param action 'deposit_funds' | 'withdraw_funds' | 'transfer' | 'edit_account' | 'deleted_account' | 'created_account'
---@param title string
---@param fields table<string|any> | nil
---@param source string | nil Player originating the the action
---@param target string | nil Player receiving the action
function Log(level, action, title, fields, source, target)
    if (not canLog) then
        warn('Logging has been set to fivemanage, but the sdk resource is unavailable.')
        warn('Make sure the resource is present and started, you can download it here:\n- https://github.com/fivemanage/sdk/releases')
        return
    end

    if level ~= 'info' and level ~= 'error' and level ~= 'success' then
        warn(('Invalid "level" parameter (%s) passed to Log function, defaulting to info.'):format(level))
        level = 'info'
    end

    if (not fields and target) then
        local identifiers = {
            discord = GetPlayerIdentifierByType(target, 'discord'),
            fivem = GetPlayerIdentifierByType(target, 'fivem'),
            license = GetPlayerIdentifierByType(target, 'license')
        }

        local identifiersString = ""
        for idType, id in pairs(identifiers) do
            if id then
                identifiersString = identifiersString .. string.format("%s: %s, ", idType, id)
            end
        end

        if (not fields) then
            fields = {}
        end

        fields.target_svid = target
        fields.target_name = GetPlayerName(target) or 'unknown'
        fields.target_identifiers = identifiersString ~= "" and identifiersString or 'no identifiers'
    end

    exports.fmsdk:Log(dataset, level, title or "FleecaNow Log", fields or nil)
end

-- Don't touch this if you don't know what it's use is
AddEventHandler('onResourceStop', function (resource)
    if (resource == resourceName) then
        canLog = false
    end
end)

AddEventHandler('onResourceStart', function (resource)
    if (resource == resourceName) then
        canLog = true
    end
end)
