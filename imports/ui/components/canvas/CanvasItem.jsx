import React from "react";
import { List, Table, Checkbox } from "semantic-ui-react";
import styled from "styled-components";

const Wrapper = styled.div`
  font-size: 1.2em;
  margin: 0 0 1.5rem;
  &:last-child {
    margin: 0;
  }
  .canvas-label {
    margin-bottom: 0.5rem;
    letter-spacing: 0.1rem;
    display: block;
    font-size: 0.6em;
    color: #999;
    text-transform: uppercase;
  }
  .not-found {
    font-size: 0.9em;
    color: #666;
    font-style: italic;
  }
  &.group {
    > .canvas-value {
      font-size: 0.8em;
      border: 1px solid #eee;
      padding: 1rem;
      .canvas-item {
        margin: 0;
      }
    }
  }
  &.repeater {
    .table {
      font-size: 0.8em;
    }
    td > .canvas-item {
      margin: 0;
    }
    td > .canvas-item > .canvas-label {
      display: none;
    }
    .group > .canvas-value {
      padding: 0;
      border: 0;
    }
  }
`;

const GroupItem = ({ field, data }) => {
  return (
    <List>
      {field.fields.map(item => (
        <List.Item key={item.key}>
          <CanvasItem field={item} data={{ value: data.value[item.key] }} />
        </List.Item>
      ))}
    </List>
  );
};

const RepeaterItem = ({ field, data }) => {
  return (
    <Table celled padded basic>
      <Table.Header>
        <Table.Row>
          {field.fields.map(fieldItem => (
            <Table.HeaderCell key={fieldItem.key}>
              {fieldItem.label}
            </Table.HeaderCell>
          ))}
        </Table.Row>
        {data.value.map((item, i) => (
          <Table.Row key={i}>
            {field.fields.map(fieldItem => (
              <Table.Cell key={fieldItem.key} verticalAlign="top">
                <CanvasItem
                  field={fieldItem}
                  data={{ value: item[fieldItem.key] }}
                />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
    </Table>
  );
};

const BooleanItem = ({ field, data }) => {
  return <Checkbox disabled checked={!!data.value} />;
};

export default class CanvasItem extends React.Component {
  _value() {
    const { field, data } = this.props;
    if (data && (data.value !== undefined && data.value !== null)) {
      switch (field.fieldType) {
        case "textarea":
        case "text":
          return data.value;
        case "facebook_location":
          return data.value.name;
        case "select":
          return field.options[data.value];
        case "group":
          return <GroupItem field={field} data={data} />;
        case "repeater":
          return <RepeaterItem field={field} data={data} />;
        case "boolean":
          return <BooleanItem field={field} data={data} />;
        default:
          return null;
      }
    } else {
      return <span className="not-found">Information not found</span>;
    }
  }
  render() {
    const { field } = this.props;
    return (
      <Wrapper key={field.key} className={`canvas-item ${field.fieldType}`}>
        <span className="canvas-label">{field.label}</span>
        <div className="canvas-value">{this._value()}</div>
      </Wrapper>
    );
  }
}
