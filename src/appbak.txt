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
  const [selectedValue, setSelectedValue] = useState("");

  //Example
  // const dataSource = [
  //   {
  //     key: 1,
  //     currency: "IDR",
  //     buy: 0.11,
  //     exchange: 0.22,
  //     sell: 0.33
  //   }
  // ];

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

    // const response = axios
    // .get('https://api.exchangeratesapi.io/latest')
    // .then((res) => {
    //   return res.data.rates;
    // });

    // response.then((res) => {
    //     let i = 1;
    //     let listRates = [];

    //     for(let item in res) {
    //       let itemRates = {
    //         key: i,
    //         currency: item,
    //         buy: res[item],
    //         exchange : res[item],
    //         sell : res[item]
    //       };

    //       listRates.push(itemRates);
    //       i = i + 1;
    //     }

    //     setDataSource(listRates);
    // });

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

  const setInputChange = (e) => {
    console.log(e.target);
    
    if (e.target.value) {
      setInputValue(parseInt(e.target.value));
    }
  }

  const SetSelectOption = (props) => {

    const setSelected = (value) => {
      setAddOnValue(value);
      setSelectedValue(value);
      
      dataSource && dataSource.map((obj, index) => {
        if(obj.currency === value){
          obj.buy = obj.buy + inputValue;
          obj.sell = obj.sell + inputValue;
          obj.exchange = obj.exchange + inputValue;
        }
      })
    }

    return (
      <>
        <Select defaultValue={selectedValue === "" ? "Choose Currency!" : selectedValue} style={{ width: 200 }} onChange={(value) => setSelected(value)}>
          {props.data && props.data.map((obj, index) => {
            return <Option key={index} value={obj.currency}>{obj.currency}</Option>
          })}
        </Select>
      </>
    );
  };

  return (
    <Row>
      <Col lg={{ span: 12, offset: 2 }}>
        <Space direction="vertical">
          <Card title={`Base Currency : ${baseSource}`} style={{ width: 900 }}>
            <Input type="number" addonBefore={addOnValue} defaultValue={inputValue} style={{ width: 200 }} onChange={setInputChange}/>
            <SetSelectOption data={dataSource} />
            <Table dataSource={dataSource} columns={columns} />
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default TableApp;