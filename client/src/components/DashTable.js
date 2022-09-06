import React from "react";
// import "antd/dist/antd.css";
import "antd/dist/antd.min.css";
import "./DashTable.scss";
import { Table } from "antd";

import useWindowDimensions from "../utils/window";

const DashTable = props => {
  // to help with table resizing when many entries must be shown on larger screen sizes
  const { height } = useWindowDimensions();

  // handler for row selection logic
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows, row) => {
      if (props.setSelectedRecords !== undefined) {
        props.setSelectedRecords(selectedRows);
      }
    },
  };

  return (
    <div>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              if (props.goToList !== undefined) {
                props.goToList(record._id);
              }
            },
          };
        }}
        columns={props.columns}
        dataSource={props.data}
        showSorterTooltip={props.showSorterTooltip}
        sticky={true}
        sortDirections={["ascend", "descend"]}
        rowKey={record => record._id}
        pagination={{
          defaultPageSize: 5,
          position: ["topRight"],
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        scroll={{ y: height - height / 2.5 }}
      />
    </div>
  );
};

export default DashTable;
