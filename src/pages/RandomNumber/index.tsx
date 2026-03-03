import React, { useState } from "react";
import { Card, InputNumber, Button, Typography, List, message as antdMessage } from "antd";

const { Title, Text } = Typography;

const RandomNumber: React.FC = () => {
  const generateNumber = () => Math.floor(Math.random() * 100) + 1;

  const [randomNumber, setRandomNumber] = useState<number>(generateNumber());
  const [guess, setGuess] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);
  const [result, setResult] = useState<string>("");

  const maxAttempts = 10;
  const isGameOver = attempts >= maxAttempts || result.includes("đúng");

  const handleGuess = () => {
    if (guess === null || isGameOver) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setHistory([...history, guess]);

    if (guess < randomNumber) {
      setResult(" Bạn đoán quá thấp!");
    } else if (guess > randomNumber) {
      setResult(" Bạn đoán quá cao!");
    } else {
      setResult(" Chúc mừng! Bạn đã đoán đúng!");
      antdMessage.success("Bạn đã chiến thắng 🎉");
      return;
    }

    if (newAttempts === maxAttempts) {
      setResult(` Bạn đã hết lượt! Số đúng là ${randomNumber}`);
      antdMessage.error("Hết lượt chơi!");
    }

    setGuess(null);
  };

  const handleReset = () => {
    setRandomNumber(generateNumber());
    setGuess(null);
    setAttempts(0);
    setHistory([]);
    setResult("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{ width: 420 }}
        bordered={false}
        hoverable
      >
        <Title level={3} style={{ textAlign: "center" }}>
           Trò chơi đoán số
        </Title>

        <Text>
          Đoán số từ <b>1 đến 100</b>
        </Text>

        <div style={{ marginTop: 10 }}>
          <Text>
            Lượt đoán: <b>{attempts}</b> / {maxAttempts}
          </Text>
        </div>

        <InputNumber
          min={1}
          max={100}
          value={guess}
          disabled={isGameOver}
          onChange={(value) => setGuess(value)}
          placeholder="Nhập số bạn đoán"
          style={{ width: "100%", marginTop: 15 }}
        />

        <Button
          type="primary"
          block
          onClick={handleGuess}
          disabled={isGameOver}
          style={{ marginTop: 15 }}
        >
          Đoán
        </Button>

        <div style={{ marginTop: 15, minHeight: 24 }}>
          <Text>{result}</Text>
        </div>

        {/* LỊCH SỬ ĐOÁN */}
        <div style={{ marginTop: 15 }}>
          <Text strong>Lịch sử đoán</Text>
          <List
            size="small"
            bordered
            dataSource={history}
            locale={{ emptyText: "Chưa có lượt đoán nào" }}
            style={{ marginTop: 8 }}
            renderItem={(item, index) => (
              <List.Item>
                Lượt {index + 1}: {item}
              </List.Item>
            )}
          />
        </div>

        {/* CHƠI LẠI */}
        {isGameOver && (
          <Button
            type="default"
            block
            onClick={handleReset}
            style={{ marginTop: 15 }}
          >
             Chơi lại
          </Button>
        )}
      </Card>
    </div>
  );
};

export default RandomNumber;