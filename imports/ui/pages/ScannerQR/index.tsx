import { useParams } from "@solidjs/router";
import {Button, ToggleButton, ToggleButtonGroup} from "@suid/material";
import {createSignal, Show} from "solid-js";
import useTitle from "../../utils/useTitle";
import ManualForm from "./ManualForm";
import CameraWidget from "/imports/ui/pages/ScannerQR/CameraWidget";
import {styled} from "solid-styled-components";


const TopButtonsGroupStyled = styled(ToggleButtonGroup)({
  position: 'absolute',
  top: '20px',
  zIndex: '99',
  left: '50%',
  transform: 'translate(-50%, 0)',
  backgroundColor: '#ffd42d',
  height: '40px',
});

const TopToggleButtonStyled = styled(ToggleButton)({
  height: "100%",
});

const ButtonBottomStyled = styled(Button)({
  backgroundColor: '#ffd42d',
  color: '#000000',
});

type Task = {
  teamNumber: number
  taskNumber: number
  action: string
  gameCode: string
}
export default function ScannerQR() {
    const params = useParams();
    useTitle(`${params.code} | MaSo 2023`);

    const [taskMode, setTaskMode] = createSignal<"solve" | "exchange" | "cancel">("solve");
    const [inputMode, setInputMode] = createSignal<"scan" | "manual">("scan");
    const [waitingForResponse, setWaitingForResponse] = createSignal<boolean>(false);
    const [prevTask, setPrevTask] = createSignal<Task>({taskNumber: -1, teamNumber: -1, action: "", gameCode: params.code});

    const taskUpdateCallback = (error, result) => {
      console.log("Server response: ", error, result);
      setWaitingForResponse(false);
      return;
    }

    const onTaskSubmit = ({teamNumber, taskNumber}: {teamNumber: number, taskNumber: number}) => {
      setWaitingForResponse(true);
      const task: Task = {
        teamNumber,
        taskNumber,
        action: taskMode(),
        gameCode: params.code,
      }

      // If scanned the same task, ignore it.
      if (
        inputMode() === "scan"
        && task.action === prevTask().action
        && task.teamNumber === prevTask().teamNumber
        && task.gameCode === prevTask().gameCode
      ) { return }

      // Send data to server
      console.log("Sending task to server: ", task);
      setWaitingForResponse(true);
      setPrevTask(task);
      Meteor.call("tasks.update", {data: task}, taskUpdateCallback)
    }

    const onQrDetected = (decodedText: string) => {
      if(waitingForResponse()) { return }

      try {
        console.log("Scanned QR text: ", decodedText);
        const matches = decodedText.match(/^T(\d+)P(\d+)$/);
        const teamNumber = parseInt(matches[1]);
        const taskNumber = parseInt(matches[2]);
        onTaskSubmit({teamNumber, taskNumber});
      } catch(e) {
        console.warn("Error decoding qr code: ", e);
      }
    }


    {/*@ts-ignore - Unfortunately, style prop doesn't exist for Typescript :(*/}
    return (
      <>
          <TopButtonsGroupStyled
            color="primary"
            value={taskMode()}
            exclusive
            onChange={(_, mode) => setTaskMode(mode)}
          >
              <TopToggleButtonStyled value="solve">Řešit</TopToggleButtonStyled>
              <TopToggleButtonStyled value="exchange">Měnit</TopToggleButtonStyled>
              <TopToggleButtonStyled value="cancel">Zrušit</TopToggleButtonStyled>
          </TopButtonsGroupStyled>
          <Show when={inputMode() == "scan"}>
              <CameraWidget onSuccess={onQrDetected} />
          </Show>
          <Show when={inputMode() == "manual"}>
              <ManualForm onTaskSubmit={onTaskSubmit} />
          </Show>
          <div style={{display: 'flex', justifyContent: 'center', margin: '5px'}}>
              <ButtonBottomStyled
                variant="contained"
                onClick={() => setInputMode((mode) => mode === "manual" ? "scan" : "manual")}>
                  {inputMode() === 'scan' ? 'Ruční zadání' : 'Zpět'}
              </ButtonBottomStyled>
          </div>
      </>
        // <ManagedSuspense loading={loading()} found={found()}>
        //     <Grid container justifyContent="center" spacing={1} style={{ margin: '20px 0', width: '100%' }}>
        //         <Grid item xs={11}>
        //             <Typography variant="h3" align="center" gutterBottom>
        //                 {game.name}
        //             </Typography>
        //         </Grid>
        //         <Grid item xs={11} sm={6}>
        //             <GameInfo game={game} user={user} />
        //             <Paper>
        //                 <List component="nav" aria-label="Device settings">
        //                 <SectionLink
        //                     header="Dataprojektor"
        //                     content="Aktuální stav hry pro zobrazení na dataprojektoru"
        //                     link={`/${game.code}/projektor`}
        //                 />
        //                 <Show when={isUserAuthorized()}>
        //                     <SectionLink
        //                         header="Zadávátko"
        //                         content="Aplikace na zadávání tahů hrajících týmů"
        //                         link={`/${game.code}/zadavatko`}
        //                     />
        //                     <SectionLink
        //                         header="Scanner příkladů"
        //                         content="Potvrzování příkladů mobilním telefonem"
        //                         link={`/${game.code}/scanner`}
        //                      />
        //                 </Show>
        //                 {/*isOwner && <SectionLink
        //                     header="Výsledky"
        //                     content="Aktuální živé výsledky"
        //                     link={`/${game.code}/vysledky`}
        //                 />*/}
        //                 </List>
        //             </Paper>
        //                 {/*isOwner && (<UserList userId={user._id} game={game} gameAuthorizedUsers={gameAuthorizedUsers} />)}*/}
        //         </Grid>
        //         <Show when={isUserOwner()}>
        //             <TeamList game={game} results={results} />
        //         </Show>
        //         {/*<GlobalStyle />
        //         </Grid>*/}
        //     </Grid>
        // </ManagedSuspense>
    )
}