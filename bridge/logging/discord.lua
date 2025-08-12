if GetLoggingMethod() ~= 'discord' then return end

        --  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
        -- ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
        -- ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
        -- ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
        -- ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
        --  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 

local webhook = false --[[ @as false | string ]]

local colors = {
    info    = 5763719,
    error   = 15548997,
    success = 5763719,
}

local function canLog()
    return webhook and type(webhook) == 'string' and string.len(webhook) > 0
end

---log an action to an external service
---@param level 'info'|'error'|'success'
---@param action 'deposit_funds'|'withdraw_funds'|'transfer'
---@param title string
---@param fields table<string|any> | nil
---@param source string | nil Player originating the the action
---@param target string | nil Player receiving the action
function Log(level, action, title, fields, source, target)
    if (not canLog()) then
        error('Impossible to log action\n- The logging method has been set to discord but no webhook was provided.')
        return
    end

    if level ~= 'info' and level ~= 'error' and level ~= 'success' then
        warn(('Invalid "level" parameter (%s) passed to Log function, defaulting to info.'):format(level))
        level = 'info'
    end

    if (not fields) then fields = {} end

    if (target) then
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

        fields.target_svid = target
        fields.target_name = GetPlayerName(target) or 'unknown'
        fields.target_identifiers = identifiersString ~= "" and identifiersString or 'no identifiers'
    end

    if source and GetPlayerName(source) then
        local identifiers = {
            discord = GetPlayerIdentifierByType(source, 'discord'),
            fivem = GetPlayerIdentifierByType(source, 'fivem'),
            license = GetPlayerIdentifierByType(source, 'license')
        }

        local identifiersString = ""
        for idType, id in pairs(identifiers) do
            if id then
                identifiersString = identifiersString .. string.format("%s: %s, ", idType, id)
            end
        end

        fields.source_svid = source
        fields.source_name = GetPlayerName(source) or 'unknown'
        fields.source_identifiers = identifiersString ~= "" and identifiersString or 'no identifiers'
    end

    local discordFields = {}
    for k, v in pairs(fields) do
        table.insert(discordFields, {
            name = string.format("**%s**", tostring(k)),
            value = string.format("```%s```", tostring(v)),
            inline = true,
        })
    end

    local data = {
        embeds = {
            {
                title = title,
                color = colors[level] or colors.info,
                timestamp = os.date("!%Y-%m-%dT%H:%M:%S.000Z"),
                fields = discordFields,
            }
        },
    }

    PerformHttpRequest(webhook, json.encode(data), 'POST', {
        ['Content-Type'] = 'application/json'
    }, function(statusCode, text, headers)
        if statusCode < 200 or statusCode >= 300 then
            warn(('Discord webhook failed with status code %s: %s'):format(statusCode, text))
        end
    end)
end
