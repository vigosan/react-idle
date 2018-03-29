import React from 'react';
import { shallow } from 'enzyme';
import Idle from './index';

jest.useFakeTimers();

const INTERVAL = 1000;
const TIMEOUT = 2000;
const tick = () => jest.advanceTimersByTime(INTERVAL);

describe('Idle', () => {
  it('renders its children as a function', () => {
    const Children = () => null;
    const wrapper = shallow(<Idle>{() => <Children />}</Idle>);

    expect(wrapper.contains(<Children />)).toBe(true);
  });

  it('notifies remaining time', () => {
    let timeleft;

    shallow(
      <Idle timeout={TIMEOUT} interval={INTERVAL}>
        {({ timeleft: idleTimeleft }) => (timeleft = idleTimeleft)}
      </Idle>
    );

    tick();

    expect(timeleft).toEqual(1000);

    tick();

    expect(timeleft).toEqual(0);
  });

  it('resets the timer', () => {
    let timeleft;
    let reset;

    shallow(
      <Idle timeout={TIMEOUT} interval={INTERVAL}>
        {({ timeleft: idleTimeleft, reset: idleReset }) => {
          timeleft = idleTimeleft;
          reset = idleReset;
        }}
      </Idle>
    );

    tick();
    reset();

    expect(timeleft).toBe(TIMEOUT);
  });

  it('notifies when idle', () => {
    let idle;

    shallow(
      <Idle timeout={TIMEOUT} interval={INTERVAL}>
        {({ idle: isIdle }) => (idle = isIdle)}
      </Idle>
    );

    tick();

    expect(idle).toBe(false);

    tick();

    expect(idle).toBe(true);
  });
});
