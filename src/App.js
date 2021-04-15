import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Space, Table, Select, Input } from "antd";
import axios from "axios";

const TableApp = () => {

    const { Option } = Select;

    const [baseSource, setBaseSource] = useState("");
    const [dataSource, setDataSource] = useState([]);

    const [rawData, setRawData] = useState({});
    const [inputValue, setInputValue] = useState("");
    const [currency, setCurrency] = useState(false);
    const [select, setSelect] = useState(false);

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
                console.log('data', data);
                setRawData(data);
                buildSelect(data);
            }
        })();
    }, []);

    useEffect(() => {
        buildDataSource(rawData, processData);
    }, [rawData, currency, inputValue]);

    const defValue = (datatable) => {
        if (!datatable) return;
        return datatable.map((item, index) => ({
            key : item.key,
            currencyName : item.currencyName,
            buy : "-",
            exchange : "-",
            sell : "-"
        }))
    }

    const calculation = (rates, type) => {
        if (!rates) return 0;
        if (!type) return 0;
        switch (type) {
            case "buy":
                return rates + 1;
            case "sell":
                return rates + 2;
        }
        return rates;
    }

    const processData = (data) => {
        if (!data) return;
        if(!currency) return defValue(data);
        if(!inputValue) return defValue(data);

        let rates = rawData.rates[currency];
        return data.map((item, index) => {
            // console.log(item.exchange);
            const convert = (type) => {
                return calculation(inputValue * item.exchange, type).toFixed(2);
            };
            
            return {
                key : item.key,
                currencyName : item.currencyName,
                buy : convert("buy"),
                exchange : item.exchange,
                sell : convert("sell")
            }
        })
    }

    const buildDataSource = (data, processFunc) => {
        let listRates = [];
        if (!data.rates) return;

        var rates = data.rates;
        let i = 0;
        for (let item in rates) {
            let val = rates[item];
            listRates.push({
                key: i++,
                currency: item,
                buy: calculation(rates[item], "buy"),
                exchange: val,
                sell: calculation(rates[item], "sell")
            });
        }
        setBaseSource(data.base);

        console.log(listRates);
        listRates = processFunc(listRates);
        setDataSource(listRates);
    }

    const onChangeCurrency = (e) => {
        console.log(e);
        setCurrency(e);
    }

    const buildSelect = (data) => {
        if (!data.rates) return;
        setSelect(
            <Select defaultValue="Select Currency" onChange={onChangeCurrency} style={{ width: 100 }}>
                {
                    Object.keys(data.rates).map((val, index) => (
                    <Option value={val}>{val}</Option>
                    ))
                }
            </Select>
        )
    }

    const onchangeInput = (e) => {
        console.log(e.target);
        let pattern = new RegExp('^[0-9]+$');
        if (e.target.value == "" || pattern.test(e.target.value)) {
            setInputValue(e.target.value);
        }
    }

    return (
        <Row>
            <Col lg={{ span: 12, offset: 2 }}>
                <Space direction="vertical">
                    <Card title={`Base Currency : ${baseSource}`} style={{ width: 900 }}>
                        <Input
                            addonBefore={select}
                            onChange={onchangeInput}
                            value={inputValue}
                            disabled={!currency}
                            placeholder="Please Input Here..."
                        >
                        </Input>
                        {dataSource && <Table dataSource={dataSource} columns={columns} />}
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default TableApp;