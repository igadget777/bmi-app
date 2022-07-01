import React, { useState } from 'react'
import { Form, InputNumber, Select, Button, Typography } from 'antd'
import axios from 'axios';
const { Text } = Typography;
const { Option } = Select;
const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const X_API_KEY = process.env.REACT_APP_X_Api_Key;
const URL = 'https://d4ht5532p2.execute-api.us-east-1.amazonaws.com/prod/';

const initValues = { bmi: '___', range: '___' };

const BMI = ({ user }) => {
  const [results, setResults] = useState(initValues)
  const [dataSaved, setDataSaved] = useState('')
  const [form] = Form.useForm();
  // The formula is BMI = kg/m2 where kg is a person’s weight in kilograms and m2 is their height in metres squared.

  const onFinish = (values) => {
    console.log(values)
    let weight = parseInt(values.weight);
    let feet = parseInt(values.feet);
    let inches = parseInt(values.inches);
    if (feet > 0 && weight > 0) {
      // convert height to meters
      let heightInMeters = convertHeightToMeters(feet, inches);
      // convert weight in lbs to ks
      let weightInKg = convertWeightToKilograms(weight);
      let bmi = calculateBMI(weightInKg, heightInMeters);
      let range = bmiRanges(bmi);
      setResults({
        bmi: bmi, range: range
      })

    } else {
      alert("Please at enter weight and height.")
    }
  };
  const onReset = () => {
    form.resetFields();
    setResults(initValues);
    setDataSaved('');
  };

  const saveTodaysBMI = async (bmi) => {
    if (bmi !== '___') {
      const url = URL + 'savebmi';
      const requestConfig = {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": X_API_KEY
        }
      }
      const requestBody = { username: user.username, bmi: bmi.toString() }

      try {
        let response = await axios.post(url, requestBody, requestConfig)
        console.log(response)
        if (response.data.statusCode === 200) {
          setDataSaved(response.data.body)
        } else {
          alert('Something went wrong!')
        }
      } catch (err) {
        console.log(err)
      }
      // let response = await axios.post(url, requestBody, requestConfig)
      // console.log(response)
      // if (response.statusCode === 200) {
      //   alert(response.body)
      // } else {
      //   alert('Something went wrong!')
      // }
    } else {
      alert("No BMI to save!")
    }
  }

  const convertHeightToMeters = (height, inches) => {
    let heightInInches = (height * 12) + inches;
    return heightInInches / 39.37;
  }

  const convertWeightToKilograms = (weight) => {
    return weight * 0.45359237;
  }
  const calculateBMI = (kg, meters) => {
    return (kg / Math.pow(meters, 2)).toFixed(1);
  }

  const bmiRanges = (bmi) => {
    // BMI ranges
    // below 18.5 – you're in the underweight range.
    // between 18.5 and 24.9 – you're in the healthy weight range.
    // between 25 and 29.9 – you're in the overweight range.
    // between 30 and 39.9 – you're in the obese range.
    let considered = '';
    if (bmi < 18.5) {
      considered = 'under weight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      considered = 'healthy weight';
    } else if (bmi >= 25 && bmi <= 29.9) {
      considered = 'overweight';
    } else if (bmi >= 30 && bmi <= 34.9) {
      considered = 'obese Class I';
    } else if (bmi >= 35 && bmi <= 40) {
      considered = 'obese Class II';
    } else {
      considered = 'obese Class III';
    }

    return considered;
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onChange = (value) => {
    console.log('changed', value);
  };
  return (
    <div className="form-wrapper">
      <Form
        {...layout}
        name="basic"
        initialValues={{ gender: 'Select', weight: 0, feet: 'Select', inches: 0 }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >

        <Form.Item
          label="Weight"
          name="weight"
          rules={[{ required: true, message: 'Please input your weight!' }]}
        >
          <InputNumber size="large" min={0} max={350} onChange={onChange} />
        </Form.Item>
        <Form.Item
          label="Feet"
          name="feet"
          rules={[{ required: true, message: 'Please input your feet!' }]}
        >
          <Select
            style={{
              width: 95,
            }}
            onChange={onChange}
          >
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Inches"
          name="inches"
          rules={[{ required: true, message: 'Please input your inches!' }]}
        >
          <Select
            style={{
              width: 95,
            }}
            onChange={onChange}
          >
            <Option value="0">0</Option>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
            <Option value="10">10</Option>
            <Option value="11">11</Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout} >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <p id="results">
        Your Body Mass Index is <span>{results.bmi}</span> This is considered <span>{results.range}</span>.
      </p>
      <div>
        <Button htmlType="button" onClick={() => saveTodaysBMI(results.bmi)}>
          Save BMI
        </Button>
        <Text>{dataSaved}</Text>
      </div>

    </div>
  )
}

export default BMI