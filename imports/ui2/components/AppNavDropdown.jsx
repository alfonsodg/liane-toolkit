import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: inline-block;
  font-weight: 400;
  z-index: 2;
  .trigger {
    cursor: pointer;
  }
  .dropdown {
    position: absolute;
    top: 39px;
    right: -25px;
    width: 380px;
    height: 300px;
    background: #fff;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.07);
    border-radius: 0 0 7px 7px;
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    &:before {
      content: "";
      background: #fff;
      position: absolute;
      width: 10px;
      height: 10px;
      top: -4px;
      right: 33px;
      transform: rotate(45deg);
      border: 1px solid #ddd;
    }
    &:after {
      content: "";
      background: #fff;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 20px;
      z-index: 1;
    }
  }
  &.has-tools {
    .dropdown:before {
      background: #f0f0f0;
    }
  }
`;

const TriggerCount = styled.span`
  position: absolute;
  bottom: -0.1rem;
  right: -0.35rem;
  display: block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background: red;
  color: #fff;
  font-weight: 600;
  border-radius: 100%;
  font-size: 0.8em;
`;

const Tools = styled.div`
  flex-grow: 0;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #dedede;
  text-align: right;
  font-size: 0.8em;
  background: #f0f0f0;
  position: relative;
  z-index: 2;
  a {
    display: inline-block;
    margin-left: 0.75rem;
    color: #999;
    &:hover {
      color: #333;
    }
  }
  .close {
    color: #000;
    &:hover {
      color: #333;
    }
  }
`;

const Content = styled.div`
  flex-grow: 1;
  overflow: auto;
  box-sizing: border-box;
  font-size: 0.9em;
  position: relative;
  z-index: 2;
  padding: 0.5rem 0 0.5rem 0;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: #ccc;
  margin: 0.5rem 0;
`;

const NavItem = styled.a`
  display: block;
  padding: 0.5rem 1.5rem;
  color: #666;
  text-decoration: none;
  /* border-bottom: 1px solid #f0f0f0; */
  font-weight: 600;
  &:hover {
    color: #111;
    background: #f0f0f0;
  }
  &:last-child {
    border: 0;
  }
`;

export default class AppNavDropdown extends Component {
  static Tools = Tools;
  static Content = Content;
  static Separator = Separator;
  static NavItem = NavItem;
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    this.links = this.node.getElementsByTagName("A");
    this._attachEvents();
  }
  componentWillUnmount() {
    this._detachEvents();
  }
  _handleWindowClick = ev => {
    if (
      ev.target !== this.node &&
      !this.node.contains(ev.target) &&
      this.state.open
    ) {
      ev.preventDefault();
      this.close();
    }
  };
  _handleKeydown = ev => {
    if (ev.keyCode == 27) {
      this.setState({
        open: false
      });
    }
  };
  _attachEvents = () => {
    window.addEventListener("click", this._handleWindowClick);
    window.addEventListener("touchstart", this._handleWindowClick);
    window.addEventListener("keydown", this._handleKeydown);
    if (this.links.length) {
      for (let i = 0; i < this.links.length; i++) {
        this.links[i].addEventListener("click", this.close);
      }
    }
  };
  _detachEvents = () => {
    window.removeEventListener("click", this._handleWindowClick);
    window.removeEventListener("touchstart", this._handleWindowClick);
    window.removeEventListener("keydown", this._handleKeydown);
    if (this.links.length) {
      for (let i = 0; i < this.links.length; i++) {
        this.links[i].removeEventListener("click", this.close);
      }
    }
  };
  close = () => {
    this.setState({
      open: false
    });
  };
  _toggle = () => ev => {
    ev.preventDefault();
    const { open } = this.state;
    this.setState({
      open: !open
    });
  };
  render() {
    const { open } = this.state;
    const {
      width,
      height,
      tools,
      trigger,
      triggerCount,
      children,
      className,
      ...props
    } = this.props;
    let classes = className || "";
    if (tools) {
      classes += " has-tools";
    }
    let style = {};
    if (width) {
      style["width"] = width;
    }
    if (height) {
      style["height"] = height;
    }
    if (!open) {
      style["display"] = "none";
    }
    return (
      <Container className={classes} {...props}>
        <span className="trigger" onClick={this._toggle()}>
          {trigger}
        </span>
        {triggerCount ? <TriggerCount>{triggerCount}</TriggerCount> : null}
        <div className="dropdown" style={style}>
          {tools ? <AppNavDropdown.Tools>{tools}</AppNavDropdown.Tools> : null}
          {children}
        </div>
      </Container>
    );
  }
}
