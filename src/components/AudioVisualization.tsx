// @ts-nocheck
import React from "react";
import { isSafari } from "react-device-detect";

const AudioVisualization = ({ analyser }: { analyser: AnalyserNode }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";

    let dt = 0;
    const start = Date.now();

    function render() {
      if (!ctx || !canvas) return;
      dt = Date.now() - start;
      ctx.resetTransform();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      const max = Math.max(canvas.width, canvas.height);
      const grd = ctx.createLinearGradient(-max / 2, 0, max, 0);
      grd.addColorStop(0, "hsl(190,100%,15%)");
      grd.addColorStop(1, "hsl(270,100%,15%)");
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = grd;
      ctx.fillRect(-max, -max, max * 2, max * 2);
      ctx.rotate(-Math.PI / 4);
      if (!isSafari) {
        ctx.fillStyle = "#99F";
        ctx.beginPath();
        ctx.arc(-50, -50, 170, 0, Math.PI * 2);
        ctx.filter = "blur(100px)";
        ctx.globalAlpha = 0.4;
        ctx.fill();
      }
      ctx.filter = "none";
      ctx.scale(1.3, 1.3);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 9;
      var rings = [
        {
          color: "hsl( 205, 60%, 55% )",
          opacity: 0.05,
          distance: 140,
          variance: 5,
          innerRings: 10,
          lineWidth: 7,
          direction: -1,
          sections: 4,
        },
        {
          color: "hsl( 205, 60%, 55% )",
          opacity: 0.2,
          distance: 140,
          variance: 4,
          innerRings: 10,
          lineWidth: 7,
          direction: -1,
          sections: 4,
        },
      ];

      analyser.getByteFrequencyData(dataArray);

      function calculatePosition(ring, j, a, func) {
        if (!ctx) return;
        var dist = ring.distance;
        var audioOffset = (ring.audioOffset + ring.lastAudio) / 2;
        var sections = 3;
        var variance = ring.variance;
        variance = 0.5 * variance + (audioOffset / 512) * 0.5 * variance;
        variance += audioOffset / 100;
        dist +=
          Math.cos(j * sections + dt / (170 - rings.indexOf(ring) * 12)) *
          5 *
          variance;
        dist +=
          Math.sin(j * sections + (a * a) / 25 + dt / 1000) * 3 * variance;
        dist += ((audioOffset / 2) * ring.distance) / 130;
        var angle = j;
        angle += a / 10;
        angle += dt / (1000 - rings.indexOf(ring) * 70);
        angle += rings.indexOf(ring);
        ctx[func](
          Math.cos(angle) * dist * ring.direction,
          Math.sin(angle) * dist * ring.direction
        );
      }

      var da = (Math.PI * 2) / 50;
      for (var i = 0; i < rings.length; i++) {
        if (rings[i].lastAudio === undefined) {
          rings[i].lastAudio = 0;
        } else {
          rings[i].lastAudio = rings[i].audioOffset;
        }
        rings[i].audioOffset =
          dataArray[Math.floor(Math.max(0.1, i / rings.length) * bufferLength)];
        if (i < 4) {
          if (rings[i].audioOffset < 100) {
            rings[i].audioOffset /= 2;
          } else {
            rings[i].audioOffset -= 50;
          }
        } else {
          rings[i].audioOffset *= 1.4;
        }
        rings[i].audioOffset *= 1.2;

        ctx.globalAlpha = rings[i].opacity;
        ctx.strokeStyle = rings[i].color;
        for (var a = 0; a < rings[i].innerRings; a++) {
          ctx.beginPath();
          ctx.lineWidth =
            rings[i].lineWidth -
            (rings[i].lineWidth * a) / rings[i].innerRings / 2;
          calculatePosition(rings[i], 0, a, "moveTo");
          for (var j = 0; j < Math.PI * 2; j += da) {
            calculatePosition(rings[i], j, a, "lineTo");
          }
          calculatePosition(rings[i], 0, a, "lineTo");
          ctx.stroke();
        }
      }
      ctx.resetTransform();
      ctx.filter = "blur(20px)";
      ctx.globalCompositeOperation = "soft-light";
      ctx.globalAlpha = 1;
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = "blur(5px)";
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.3;
      ctx.drawImage(canvas, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "blur(8px)";
      ctx.globalAlpha = 0.4;
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = "none";

      requestAnimationFrame(render);
    }

    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.onresize = resize;
    resize();
    render();
  }, [analyser]);

  return <canvas ref={canvasRef} />;
};

export default AudioVisualization;
