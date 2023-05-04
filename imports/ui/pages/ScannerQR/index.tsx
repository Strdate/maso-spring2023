import { useParams, useSearchParams } from "@solidjs/router";
import { Button, ToggleButton, ToggleButtonGroup } from "@suid/material";
import { createSignal, Show } from "solid-js";
import useClass from "../../utils/useClass";
import useTitle from "../../utils/useTitle";
import ManualForm from "./ManualForm";
import CameraWidget from "/imports/ui/pages/ScannerQR/cameraWidget";
import { TaskBase, TaskInput, TaskActionString, TaskReturnData } from "/imports/core/interfaces";
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';

export default function ScannerQR() {
    useClass('task-scanner')
    useTitle(`Scanner | MaSo 2023`)
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [inputMode, setInputMode] = [
        () => searchParams.mode === 'manual' ? 'manual' : 'scan',
        (mode: 'manual' | 'scan') => setSearchParams({ mode: mode === 'manual' ? 'manual' : undefined })
    ]
    
    const [taskMode, setTaskMode] = createSignal<TaskActionString>('solve');
    const [waitingForResponse, setWaitingForResponse] = createSignal<boolean>(false);
    let prevTask: TaskBase = {
        teamNumber: -1,
        taskNumber: -1,
        action: 'solve'
    }

    const taskUpdateCallback = (error: any, result: TaskReturnData) => {
      setWaitingForResponse(false)
      try {
        if(result)
        {
          const {teamNumber, teamName, taskNumber, taskStatusId, print, printNumber} = result
          switch(taskStatusId) {
            case 1:
              alertify.warning(`Zrušena úloha ${taskNumber} týmu ${teamNumber} ${teamName}`)
              break
            case 2:
              alertify.success(`Vyřešena úloha ${taskNumber} týmu ${teamNumber} ${teamName}. ${print ? ` Nová: ${printNumber}` : ``}`)
              break
            case 3:
              alertify.warning(`Vyměněna úloha ${taskNumber} týmu ${teamNumber} ${teamName}`)
              break
          }
        }
        else
        {
          if(error?.error == 'tasks.update.notLoggedIn') {
            window.location.href = '/login'
          }
          if(error.reason) {
            alertify.error(error.reason)
          } else {
            alertify.error('Neznámá chyba') 
          }
        }
      } catch (er) {
        alertify.error('Chyba při zpracování odpovědi ze serveru')
      }
    }

    const onTaskSubmit = ({teamNumber, taskNumber}: {teamNumber: number, taskNumber: number}) => {
      const task: TaskBase = {
        teamNumber: teamNumber,
        taskNumber: taskNumber,
        action: taskMode()
      }

      // If scanned the same task, ignore it.
      if (
        inputMode() === 'scan'
        && task.action === prevTask.action
        && task.teamNumber === prevTask.teamNumber
        && task.taskNumber === prevTask.taskNumber
      ) { return }
      
      setWaitingForResponse(true)

      // Send data to server
      prevTask = task
      const taskInput: TaskInput = {...task, gameCode: params.code}
      console.log("Sending task to server: ", task)
      Meteor.call("tasks.update", {data: taskInput}, taskUpdateCallback)
    }

    const onQrDetected = (decodedText: string) => {
      if(waitingForResponse()) { return }

      try {
        console.log("Scanned QR text: ", decodedText);
        const matches = decodedText.match(/^T(\d+)P(\d+)$/)!;
        const teamNumber = parseInt(matches[1]);
        const taskNumber = parseInt(matches[2]);
        onTaskSubmit({teamNumber, taskNumber});
      } catch(e) {
        console.warn("Error decoding qr code: ", e);
      }
    }

    return (
      <>
        <div class='task-mode-group' classList={{
            'floating-tmg': inputMode() === 'scan',
            'inline-tmg': inputMode() === 'manual',
        }}>
            <ToggleButtonGroup
                color='primary'
                value={taskMode()}
                exclusive
                onChange={(_, mode) => setTaskMode(mode)}
                class='tmg-inner'
            >
                <ToggleButton style={{height: '40px'}} value='solve'>Řešit</ToggleButton>
                <ToggleButton style={{height: '40px'}} value='exchange'>Měnit</ToggleButton>
                <ToggleButton style={{height: '40px'}} value='cancel'>Zrušit</ToggleButton>
            </ToggleButtonGroup>
        </div>
        <Show when={inputMode() == 'scan'}>
            <CameraWidget onSuccess={onQrDetected} />
        </Show>
        <Show when={inputMode() == 'manual'}>
            <ManualForm onTaskSubmit={onTaskSubmit} />
        </Show>
        <div style={{display: 'flex', 'justify-content': 'center', margin: '5px'}}>
            <Button
              variant='contained'
              onClick={() => setInputMode(inputMode() === "manual" ? "scan" : "manual")}>
                {inputMode() === 'scan' ? 'Ruční zadání' : 'Zpět'}
            </Button>
        </div>
      </>
    )
}