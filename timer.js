import React, {Component} from 'react'
import blessed from 'neo-blessed'
import { createBlessedRenderer } from 'react-blessed'
import Cube from 'cubejs'
const render = createBlessedRenderer(blessed);

/**
 * Stylesheet
 */
const stylesheet = {
  bordered: {
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'blue'
      }
    }
  }
};

/**
 * Top level component.
 */
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scramble: "",
      foo: "Testing",
      times: [],
      isTiming: false,
      totalElapsedSeconds: 0,
      currentTime: 0
    }
    this.timer = 0;

    this.generateScramble = this.generateScramble.bind(this);
    this.handleSpacebar = this.handleSpacebar.bind(this);
    this.tick = this.tick.bind(this);
  }

  tick() {
    let totalElapsedSeconds = ((new Date().getTime() - this.state.currentTime) / 1000).toFixed(2);
    this.setState({totalElapsedSeconds})
  }

  generateScramble() {
    let ret = '';
    let c, b, j, m;
    const r=Math.random;
    for(c=b=j=25; j; c+b-5|c-m&&b-m?ret+=("URFBLD"[j--,c=b,b=m]+" 2'"[0|r()*3]+" "):0)
      m=0 | r()*6
    return ret
  }

  handleSpacebar() {
    // Stopping timer
    if (this.state.isTiming) {
      clearInterval(this.timer)
      this.setState(prevState => {
        return {
          times: [
            ...prevState.times,
            prevState.totalElapsedSeconds
          ],
          currentTime: prevState.totalElapsedSeconds
        }
      })
    }
    // Beginning timer
    else {
      this.setState({ 
        currentTime: new Date().getTime(),
        scramble: this.generateScramble()
      })
      this.timer = setInterval(this.tick.bind(this), 10);
    }
    this.setState(prevState => ({ isTiming: !prevState.isTiming }))
  }

  componentDidMount() {
    this.props.addKeypressListener('space', this.handleSpacebar);
    // Cube.scramble(alg => this.setState({ scramble: alg }));
  }

  render() {
    return (
      <element>
        <Timer
          currentTime={this.state.currentTime}
          isTiming={this.state.isTiming}
          times={this.state.times}
        />
        <TimeList
          times={this.state.times}
        />
        <Scramble
          scramble={this.state.scramble}
        />
      </element>
    );
  }
}

/**
 * Timer Component
 */
const Timer = (props) => {
  return (
      <bigtext label={"Timer"}
          class={stylesheet.bordered}
          top="10%"
          left="15%"
          width="65%"
          height="70%"
      >
        {props.isTiming ? JSON.stringify(props) : props.currentTime}
      </bigtext>
  );
};


/**
 * TimeList Component
 */
const TimeList = (props) => {
  return (
      <list label={"Times"}
        class={stylesheet.bordered}
        top="10%"
        width="15%"
        items={props.times}
      />
  );
};


/**
 * Scramble Component
 */
const Scramble = (props) => {
  return (
      <box label={"Times"}
          class={stylesheet.bordered}
          height="10%" 
      >

        {props.scramble}

      </box>
  );
};

/**
 * Rendering the screen.
 */
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed dashboard'
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

render(
  <Dashboard
    addKeypressListener={(key, fn) => screen.key(key, fn)}
  />, screen
);
