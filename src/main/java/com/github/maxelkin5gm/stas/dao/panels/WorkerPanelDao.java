package com.github.maxelkin5gm.stas.dao.panels;

import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@AllArgsConstructor
public class WorkerPanelDao {
    JdbcTemplate jdbcTemplate;

    final String sql = """
            SELECT receivedNameSto, amount, receivedNameDetail, receivedOperationNumber, operationDate, side,
                cellNumber, status, note
            FROM CELL, WORKER, RECEIVED_STO
            WHERE RECEIVED_STO.cell_id = CELL.id AND RECEIVED_STO.worker_id = WORKER.id
                AND personnelNumber = ?""";

    public List<Map<String, Object>> findAllReceivedByWorkerAndStas(String personnelNumber, int stasIndex) {
        String sqlWithStasIndex = sql + " AND stasIndex = ?;";
        return jdbcTemplate.queryForList(sqlWithStasIndex, personnelNumber, stasIndex);
    }

    public List<Map<String, Object>> findAllReceivedByWorker(String personnelNumber) {
        return jdbcTemplate.queryForList(sql, personnelNumber);
    }
}
