import React from 'react';
import { Card, Rate, Typography, Tag, Button } from 'antd';
import { Destination } from '../types';

const { Meta } = Card;
const { Text } = Typography;

const DestinationCard: React.FC<{ destination: Destination; onSelect?: (dest: Destination) => void }> = ({ destination, onSelect }) => {
  return (
    <Card
      hoverable
      cover={<img alt={destination.name} src={destination.image} style={{ height: 180, objectFit: 'cover' }} />}
      actions={onSelect ? [<Button type="link" onClick={() => onSelect(destination)}>Chọn</Button>] : []}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1 }}
    >
      <Meta
        title={destination.name}
        description={
          <>
            <Text type="secondary">{destination.location}</Text>
            <div><Rate disabled defaultValue={destination.rating} allowHalf style={{ fontSize: 14 }} /></div>
            <Tag color="blue">{destination.type}</Tag>
            <div><Text strong>{destination.price.toLocaleString()} VND</Text></div>
          </>
        }
      />
    </Card>
  );
};

export default DestinationCard;