export const scrollToSmoothly = (element, pos, currentPos, time) => {
    var start = null;
        if (time == null) time = 500;
        pos = +pos, time = +time;

        const step = (currentTime) => {
          start = !start ? currentTime : start;
          var progress = currentTime - start;

          if (currentPos < pos) {
            element.scrollTop = (pos - currentPos) * progress / time + currentPos;
          } else {
            element.scrollTop = currentPos - (currentPos - pos) * progress / time;
          }

          if (progress < time) {
            window.requestAnimationFrame(step);
          } else {
            element.scrollTop = pos;
          }
        }

        window.requestAnimationFrame(step);
  };