import React from 'react';
import {Button} from "antd";
import {useTypeSelector} from "../../../hooks/useTypeSelector";
import {useTypeDispatch} from "../../../hooks/useTypeDispatch";

import {StasStateEnum} from "../../../store/stasReducer/types/state";
import {StatusCell} from "../../../store/stasReducer/types/selectedCell";
import {StasService} from "../../../services/StasService";
import {UtilsStore} from "../../../store/UtilsStore";

interface ActionPanelProps {
    stasIndex: number,
}

const ActionPanel = ({stasIndex}: ActionPanelProps) => {
    const selectedCell = useTypeSelector(state => state.stasList[stasIndex].selectedCell);
    const stasState = useTypeSelector(state => state.stasList[stasIndex].state);
    const dispatch = useTypeDispatch()

    let statusText = selectedCell?.status === StatusCell.INSTALLED ? "УСТАН." : null
    statusText = selectedCell?.status === StatusCell.REMOVED ? "СНЯТА" : statusText

    const stasService = new StasService(dispatch, stasIndex);

    function bringCellHandler() {
        if (!selectedCell) {
            UtilsStore.showError(dispatch, "Ячейка не выбрана")
            return
        }
        stasService.bringCell(selectedCell.side, selectedCell.cellNumber)
            .catch(() => UtilsStore.showError(dispatch));
    }

    function bringBackCellHandler() {
        stasService.bringBackCell()
            .catch(() => UtilsStore.showError(dispatch));
    }

    function removeCellHandler() {
        // actionPanelService.removeCell()
    }

    return (
        <>
            <div>
                <h3>Действия</h3>
            </div>

            <div>
                {selectedCell
                    ? <h3>Выбрано: <span style={{
                        border: "1px solid black",
                        padding: 5
                    }}>{selectedCell.cellNumber} {selectedCell.side} {statusText}</span></h3>
                    : <h3>Ячейка не выбрана</h3>
                }
            </div>

            <div>
                <Button
                    disabled={!selectedCell || stasState !== StasStateEnum.READY || selectedCell.status === StatusCell.REMOVED}
                    style={{width: "90%"}} type="primary" size="middle"
                    onClick={bringCellHandler}>Привезти</Button>
            </div>

            <div>
                <Button disabled={stasState !== StasStateEnum.WAIT}
                        style={{width: "90%"}} type="primary" size="middle"
                        onClick={bringBackCellHandler}>Увезти</Button>
            </div>

            <div>
                <Button
                    disabled={!selectedCell || stasState === StasStateEnum.GO || (stasState === StasStateEnum.READY && selectedCell?.status === StatusCell.INSTALLED)}
                    style={{width: "90%"}} type="primary" size="middle"
                    onClick={removeCellHandler}>{stasState === StasStateEnum.WAIT ? <>Снять</> : <>Вернуть</>}</Button>
            </div>
        </>
    );
};

export default ActionPanel;