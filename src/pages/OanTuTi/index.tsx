import React, { useState } from "react";
import {
  Card,
  Button,
  List,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Statistic
} from "antd";

const { Title, Text } = Typography;

type Choice = "kéo" | "búa" | "bao";

interface History {
  player: Choice;
  computer: Choice;
  result: string;
}

const choices: Choice[] = ["kéo", "búa", "bao"];

const icons: Record<Choice, string> = {
  kéo: "✌️",
  búa: "✊",
  bao: "✋"
};

export default function RockPaperScissors() {
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<History[]>([]);
  const [win, setWin] = useState(0);
  const [lose, setLose] = useState(0);
  const [draw, setDraw] = useState(0);

  const playGame = (playerChoice: Choice) => {
    const computerChoice =
      choices[Math.floor(Math.random() * choices.length)];

    let gameResult = "";

    if (playerChoice === computerChoice) {
      gameResult = "Hòa";
      setDraw(draw + 1);
    } else if (
      (playerChoice === "kéo" && computerChoice === "bao") ||
      (playerChoice === "búa" && computerChoice === "kéo") ||
      (playerChoice === "bao" && computerChoice === "búa")
    ) {
      gameResult = "Bạn thắng";
      setWin(win + 1);
    } else {
      gameResult = "Bạn thua";
      setLose(lose + 1);
    }

    setResult(`Bạn ${icons[playerChoice]} vs Máy ${icons[computerChoice]}`);

    setHistory([
      { player: playerChoice, computer: computerChoice, result: gameResult },
      ...history
    ]);
  };

  const color = (r: string) => {
    if (r === "Bạn thắng") return "green";
    if (r === "Bạn thua") return "red";
    return "gold";
  };

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={22} sm={18} md={12} lg={10}>
        <Card>

          <Title level={3} style={{ textAlign: "center" }}>
            🎮 Oẳn Tù Tì
          </Title>

          {/* Buttons */}
          <Space style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            {choices.map((choice) => (
              <Button
                key={choice}
                type="primary"
                size="large"
                onClick={() => playGame(choice)}
              >
                {icons[choice]} {choice}
              </Button>
            ))}
          </Space>

          {/* Result */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Text strong>{result}</Text>
          </div>

          {/* Score */}
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={8}>
              <Statistic title="Thắng" value={win} />
            </Col>

            <Col span={8}>
              <Statistic title="Thua" value={lose} />
            </Col>

            <Col span={8}>
              <Statistic title="Hòa" value={draw} />
            </Col>
          </Row>

          {/* History */}
          <List
            header={<b>Lịch sử ván đấu</b>}
            bordered
            dataSource={history}
            renderItem={(item) => (
              <List.Item>
                {icons[item.player]} vs {icons[item.computer]}
                <Tag color={color(item.result)} style={{ marginLeft: 10 }}>
                  {item.result}
                </Tag>
              </List.Item>
            )}
          />

        </Card>
      </Col>
    </Row>
  );
}