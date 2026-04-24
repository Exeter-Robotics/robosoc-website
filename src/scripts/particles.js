// Kinematic chain (robot arm) IK visualization
// Multiple robot arms solve toward drifting targets using CCD
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let animId = null;
  let arms = [];
  let targets = [];
  let time = 0;

  const ARM_COUNT = 3;
  const SEGMENTS = 5;
  const SEG_LENGTH = 40;
  const TRAIL_LENGTH = 12;
  const CCD_ITERATIONS = 8;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initArms();
  }

  function initArms() {
    arms = [];
    targets = [];
    for (let i = 0; i < ARM_COUNT; i++) {
      const baseX = width * (0.2 + 0.3 * i) + (Math.random() - 0.5) * 100;
      const baseY = height * (0.4 + Math.random() * 0.3);
      const angles = [];
      for (let j = 0; j < SEGMENTS; j++) {
        angles.push(-Math.PI / 2 + (Math.random() - 0.5) * 0.5);
      }
      arms.push({
        baseX,
        baseY,
        angles,
        trail: [],
      });
      targets.push({
        x: baseX + (Math.random() - 0.5) * 200,
        y: baseY - 100 - Math.random() * 150,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
      });
    }
  }

  function getJointPositions(arm) {
    const positions = [{ x: arm.baseX, y: arm.baseY }];
    let cumAngle = 0;
    for (let i = 0; i < arm.angles.length; i++) {
      cumAngle += arm.angles[i];
      const prev = positions[positions.length - 1];
      positions.push({
        x: prev.x + Math.cos(cumAngle) * SEG_LENGTH,
        y: prev.y + Math.sin(cumAngle) * SEG_LENGTH,
      });
    }
    return positions;
  }

  function solveCCD(arm, target) {
    for (let iter = 0; iter < CCD_ITERATIONS; iter++) {
      for (let i = arm.angles.length - 1; i >= 0; i--) {
        const positions = getJointPositions(arm);
        const joint = positions[i];
        const endEffector = positions[positions.length - 1];

        const toEnd = Math.atan2(endEffector.y - joint.y, endEffector.x - joint.x);
        const toTarget = Math.atan2(target.y - joint.y, target.x - joint.x);

        let delta = toTarget - toEnd;
        while (delta > Math.PI) delta -= 2 * Math.PI;
        while (delta < -Math.PI) delta += 2 * Math.PI;

        // Dampen the correction for smoother motion
        arm.angles[i] += delta * 0.3;
      }
    }
  }

  function moveTargets() {
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const arm = arms[i];

      // Smooth drifting with sine waves for organic motion
      t.x = arm.baseX + Math.sin(time * 0.0008 + t.phaseX) * (width * 0.15);
      t.y = arm.baseY + Math.cos(time * 0.0006 + t.phaseY) * (height * 0.15) - SEG_LENGTH * 2;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time++;

    if (!prefersReduced) {
      moveTargets();
    }

    for (let a = 0; a < arms.length; a++) {
      const arm = arms[a];
      const target = targets[a];

      if (!prefersReduced) {
        solveCCD(arm, target);
      }

      const positions = getJointPositions(arm);
      const endPos = positions[positions.length - 1];

      // Store trail
      arm.trail.push({ x: endPos.x, y: endPos.y });
      if (arm.trail.length > TRAIL_LENGTH) {
        arm.trail.shift();
      }

      // Draw trail (fading dots showing end-effector path)
      for (let t = 0; t < arm.trail.length; t++) {
        const alpha = (t / arm.trail.length) * 0.12;
        ctx.fillStyle = `rgba(232, 116, 44, ${alpha})`;
        ctx.beginPath();
        ctx.arc(arm.trail[t].x, arm.trail[t].y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw arm segments
      ctx.strokeStyle = 'rgba(232, 116, 44, 0.15)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(positions[0].x, positions[0].y);
      for (let j = 1; j < positions.length; j++) {
        ctx.lineTo(positions[j].x, positions[j].y);
      }
      ctx.stroke();

      // Draw joints
      for (let j = 0; j < positions.length; j++) {
        const isBase = j === 0;
        const isEnd = j === positions.length - 1;
        const radius = isBase ? 6 : isEnd ? 4 : 3;
        const alpha = isBase ? 0.25 : isEnd ? 0.3 : 0.15;

        ctx.fillStyle = `rgba(232, 116, 44, ${alpha})`;
        ctx.beginPath();
        ctx.arc(positions[j].x, positions[j].y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Ring around joints
        if (!isBase) {
          ctx.strokeStyle = `rgba(232, 116, 44, ${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(positions[j].x, positions[j].y, radius + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw base mount (triangle)
      ctx.fillStyle = 'rgba(232, 116, 44, 0.12)';
      ctx.beginPath();
      ctx.moveTo(arm.baseX - 12, arm.baseY + 8);
      ctx.lineTo(arm.baseX + 12, arm.baseY + 8);
      ctx.lineTo(arm.baseX, arm.baseY);
      ctx.closePath();
      ctx.fill();

      // Draw target crosshair
      const tAlpha = 0.1;
      ctx.strokeStyle = `rgba(232, 116, 44, ${tAlpha})`;
      ctx.lineWidth = 1;
      const crossSize = 8;
      ctx.beginPath();
      ctx.moveTo(target.x - crossSize, target.y);
      ctx.lineTo(target.x + crossSize, target.y);
      ctx.moveTo(target.x, target.y - crossSize);
      ctx.lineTo(target.x, target.y + crossSize);
      ctx.stroke();

      // Small circle around target
      ctx.beginPath();
      ctx.arc(target.x, target.y, crossSize + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (!prefersReduced) {
      animId = requestAnimationFrame(draw);
    }
  }

  resize();
  draw();

  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('beforeunload', () => {
    if (animId) cancelAnimationFrame(animId);
  });
}
