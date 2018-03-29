import { Component } from 'react';
import PropTypes from 'prop-types';

class Idle extends Component {
  static propTypes = {
    autoReset: PropTypes.bool,
    children: PropTypes.func,
    events: PropTypes.arrayOf(PropTypes.string),
    interval: PropTypes.number,
    timeout: PropTypes.number
  };

  static defaultProps = {
    autoReset: false,
    children: () => null,
    events: ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'],
    interval: 1000,
    timeout: 1000 * 60 * 30
  };

  state = {
    timeleft: this.props.timeout,
    idle: false
  };

  componentDidMount() {
    this.props.events.forEach(
      e => window.addEventListener(e, this.reset),
      true
    );

    this.countdown = setInterval(this.tick, this.props.interval);
  }

  componentWillUnmount() {
    this.props.events.forEach(
      e => window.removeEventListener('e', this.reset),
      true
    );

    clearInterval(this.countdown);
  }

  tick = () => {
    if (this.state.idle) return;

    this.setState(prevState => {
      const timeleft = prevState.timeleft - this.props.interval;
      const idle = timeleft <= 0;
      return { timeleft: idle ? 0 : timeleft, idle };
    });
  };

  reset = () => {
    if (!this.props.autoReset && this.state.idle) return;

    this.setState(() => {
      return { timeleft: this.props.timeout, idle: false };
    });
  };

  getStateAndHelpers() {
    return { ...this.state, reset: this.reset };
  }

  render() {
    return this.props.children(this.getStateAndHelpers());
  }
}

export default Idle;
