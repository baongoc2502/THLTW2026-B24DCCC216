import { Tag } from "antd";

export default ({ tags, onSelect }: any) => (
  <>
    {tags.map((t: string) => (
      <Tag key={t} onClick={() => onSelect(t)} style={{ cursor: "pointer" }}>
        {t}
      </Tag>
    ))}
  </>
);