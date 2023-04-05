import { useParams } from "@solidjs/router";
import { Grid, List, Paper, Typography } from "@suid/material";
import { createEffect, createMemo, Show } from "solid-js";
import { createFindOne, createSubscribe } from "solid-meteor-data";
import ManagedSuspense from "../../components/managedSuspense";
import useTitle from "../../utils/useTitle";
import GameInfo from "./gameInfo";
import SectionLink from "./sectionLink";
import TeamList from "./teamList";
import { Game, GameCollection } from "/imports/api/collections/games";
import { isAuthorized, isGameOwner } from "/imports/core/authorization";

export default function GameOverview() {
    const params = useParams()
    useTitle(`${params.code} | MaSo 2023`)
    const loading = createSubscribe('game', () => params.code)
    const [found, gameFound] = createFindOne(() => loading() ? undefined : GameCollection.findOne({code: params.code}))
    const game = gameFound as Game

    const [loggedIn, userFound] = createFindOne(() => Meteor.user())
    const user = userFound as Meteor.User
    const isUserAuthorized = createMemo(() => loggedIn() && isAuthorized(user,game))
    const isUserOwner = createMemo(() => isGameOwner(user,game))
    
    // const authorizedUsers = createFind(() => loading() ? null : Meteor.users.find(params.code))

    createEffect(() => {
        console.log(`Loading: ${loading()}, found: ${found()}, code: ${params.code}`)
    })

    return (
        <ManagedSuspense loading={loading()} found={found()}>
            <Grid container justifyContent="center" spacing={1} style={{ margin: '20px 0', width: '100%' }}>
                <Grid item xs={11}>
                    <Typography variant="h3" align="center" gutterBottom>
                        {game.name}
                    </Typography>
                </Grid>
                <Grid item xs={11} sm={6}>
                    <GameInfo game={game} user={user} />
                    <Paper>
                        <List component="nav" aria-label="Device settings">
                        <SectionLink
                            header="Dataprojektor"
                            content="Aktuální stav hry pro zobrazení na dataprojektoru"
                            link={`/${game.code}/projektor`}
                        />
                        {/*<Show when={isUserAuthorized()}>*/}
                            <SectionLink
                                header="Zadávátko"
                                content="Aplikace na zadávání tahů hrajících týmů"
                                link={`/${game.code}/input`}
                            />
                            <SectionLink
                                header="Scanner příkladů"
                                content="Potvrzování příkladů mobilním telefonem"
                                link={`/${game.code}/scanner`}
                             />
                             <SectionLink
                                header="Výsledky"
                                content="Aktuální živé výsledky"
                                link={`/${game.code}/vysledky`}
                             />
                        {/*</Show>*/}
                        {/*isOwner && <SectionLink
                            header="Výsledky"
                            content="Aktuální živé výsledky"
                            link={`/${game.code}/vysledky`}
                        />*/}
                        </List>
                    </Paper>
                        {/*isOwner && (<UserList userId={user._id} game={game} gameAuthorizedUsers={gameAuthorizedUsers} />)}*/}
                </Grid>
                <Show when={isUserOwner()}>
                    <TeamList game={game} />
                </Show>
                {/*<GlobalStyle />
                </Grid>*/}
            </Grid>
        </ManagedSuspense>
    )
}