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
---@param level 'info'|'error'|'success'
---@param title string
---@param fields? table<string|any>
function Log(level, title, fields)
    if (not canLog) then
        warn('Logging has been set to fivemanage, but the sdk resource is unavailable.')
        warn('Make sure the resource is present and started, you can download it here:\n- https://github.com/fivemanage/sdk/releases')
        return
    end

    if level ~= 'info' and level ~= 'error' and level ~= 'success' then
        warn(('Invalid "level" parameter (%s) passed to Log function, defaulting to info.'):format(level))
        level = 'info'
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

exports('Log', Log)
