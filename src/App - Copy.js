import React, { useState } from 'react';
import { Card, Col, Row, Space, Table, Select, Input } from "antd";
import { useEffect } from "react";
import axios from "axios";

const TableApp = () => {

  const { Option } = Select;

  const [baseSource, setBaseSource] = useState("");
  const [dataSource, setDataSource] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [addOnValue, setAddOnValue] = useState("CAD");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const columns = [
    {
      title: '',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: 'WE BUY',
      dataIndex: 'buy',
      key: 'buy',
    },
    {
      title: 'EXCHANGE RATES',
      dataIndex: 'exchange',
      key: 'exchange',
    },
    {
      title: 'WE SELL',
      dataIndex: 'sell',
      key: 'sell',
    }
  ];

  useEffect(() => {
    (async () => {
      const result = await axios.get('https://api.exchangeratesapi.io/latest');
      if (result === 200) return;

      const data = result?.data;
      if (data) {
        const rates = data?.rates;
        const listRates = [];

        let i = 0;
        for (let item in rates) {
          let val = rates[item];
          listRates.push({
            key: i++,
            currency: item,
            buy: val,
            exchange: val + 1,
            sell: val + 2
          });
        }

        setBaseSource(data.base);
        setDataSource(listRates);
      }
    })();
  }, []);

  useEffect(() => {

  });

  const onChangeInput = (e) => {
    setInputCurrency(e.target.value);
  }

  const onChangeSelect = (val) => {
    const selectedData = rawData.rates[val];
    setSelectedCurrency(selectedData);
  };

  return (
    <Row>
      <Col lg={{ span: 12, offset: 2 }}>
        <Space direction="vertical">
          <Card title={`Base Currency : ${baseSource}`} style={{ width: 900 }}>
            <Input type="number" 
            addonBefore="IDR" value={inputCurrency} onChange={onChangeInput} />

            <Select onChange={onChangeSelect} defaultValue="IDR">
              {dataSource && 
                dataSource.map((v, index) => {
                return (
                  <Option key={index} value={v.currencyName}>{v.currencyName}</Option>
                )
              })}
            </Select>
            
            {selectedCurrency}

            <Table dataSource={dataSource} columns={columns} />
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default TableApp;