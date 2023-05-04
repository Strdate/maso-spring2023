import { getServerConfig } from "./config";

function setupAccountRules() {
    Accounts.onCreateUser((options, user) => {
        // @ts-ignore
        if (options.allowedServer) {
            // @ts-ignore
            user.allowedServer = options.allowedServer
        }

        if (options.profile) {
            user.profile = options.profile;
        }
        return user;
    })

    Accounts.validateLoginAttempt((details: any) => {
        //console.log(JSON.stringify(details))
        const user = details.user as {username: string, allowedServer?: string}
        const cfg = getServerConfig()
        if(cfg.enforceLoginAffinity) {
            if(user.allowedServer && user && user.allowedServer !== cfg._self) {
                const redir = cfg.servers.find(s => s.ident === user.allowedServer)
                if(redir) {
                    throw new Meteor.Error('user.logIn.incorrectServerRedir', `${redir.url}/login`)
                }
                throw new Meteor.Error('user.logIn.incorrectServer', 'Jsi na chybném serveru!')
            }
        }
        return true
    })
}

export { setupAccountRules }