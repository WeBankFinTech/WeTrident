/**
 * Created by erichua on 11/11/2017.
 */

export default {
  scaleInOut: { // open: fade in, close: fade out
    openAnimation: {
      from: {
        scale: 1.1
      },
      to: {
        scale: 1
      }
    },
    closingAnimation: {
      from: {
        opacity: 1
      },
      to: {
        opacity: 0
      }
    }
  },
  slideUpDown: { // open: slide in, close: slide down
    openAnimation: {
      from: {
        translateY: 450,
        opacity: 0
      },
      to: {
        translateY: 0,
        opacity: 1
      }
    },
    closingAnimation: {
      from: {
        translateY: 0,
        opacity: 1
      },
      to: {
        translateY: 450,
        opacity: 1
      }
    }
  }
}
