/* ============================================================
   NATIONAL PLASTO — THREE.JS 3D HERO SCENE
   Photorealistic rotating chair / product model using
   Three.js with PBR materials, dramatic lighting,
   cursor-reactive camera drift, and scroll response.
   ============================================================ */

(function() {
  'use strict';

  /* Wait for Three.js to load */
  function waitForThree(callback) {
    if (typeof THREE !== 'undefined') {
      callback();
    } else {
      setTimeout(() => waitForThree(callback), 50);
    }
  }

  waitForThree(init);

  function init() {
    const canvas = document.getElementById('canvas-hero');
    if (!canvas) return;

    /* ── SCENE SETUP ── */
    const scene = new THREE.Scene();
    const W = canvas.clientWidth  || window.innerWidth;
    const H = canvas.clientHeight || window.innerHeight;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    /* Camera */
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 1.2, 6);
    camera.lookAt(0, 0, 0);

    /* ── LIGHTING ── */

    /* Ambient — very low, sets base shadow tone */
    const ambient = new THREE.AmbientLight(0xF5EEE0, 0.4);
    scene.add(ambient);

    /* Key light — dramatic side lighting from top-right */
    const keyLight = new THREE.DirectionalLight(0xFFEEDD, 3.5);
    keyLight.position.set(4, 6, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    /* Fill light — cool blue from opposite side */
    const fillLight = new THREE.DirectionalLight(0x4A80CC, 0.8);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    /* Rim light — crimson brand accent from behind */
    const rimLight = new THREE.PointLight(0xC8102E, 1.5, 8);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    /* Ground light — subtle bounce */
    const groundLight = new THREE.PointLight(0xFFEEDD, 0.4, 6);
    groundLight.position.set(0, -2, 2);
    scene.add(groundLight);

    /* ── MATERIALS ── */

    /* Premium plastic material — slightly pearlescent */
    const chairMaterial = new THREE.MeshStandardMaterial({
      color: 0x1C2035,
      roughness: 0.15,
      metalness: 0.05,
      envMapIntensity: 1.2,
    });

    /* Accent material — crimson brand color */
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xC8102E,
      roughness: 0.2,
      metalness: 0.0,
      envMapIntensity: 0.8,
    });

    /* Dark matte material for legs/frame */
    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x0F1320,
      roughness: 0.3,
      metalness: 0.1,
    });

    /* ── PRODUCT GROUP ── */
    const product = new THREE.Group();
    scene.add(product);

    /* Build a premium-looking chair geometry from primitives */
    function buildChair() {
      const chair = new THREE.Group();

      /* --- SEAT --- */
      const seatGeo = new THREE.BoxGeometry(2.2, 0.12, 1.9);
      /* Round edges via subtle extrude — using BoxGeometry with corner workaround */
      const seatMesh = new THREE.Mesh(seatGeo, chairMaterial);
      seatMesh.position.y = 0;
      seatMesh.castShadow = true;
      seatMesh.receiveShadow = true;
      chair.add(seatMesh);

      /* Seat lip / edge detail */
      const seatLipGeo = new THREE.BoxGeometry(2.28, 0.06, 1.98);
      const seatLip = new THREE.Mesh(seatLipGeo, accentMaterial);
      seatLip.position.y = -0.06;
      chair.add(seatLip);

      /* --- BACKREST --- */
      const backGeo = new THREE.BoxGeometry(2.2, 1.5, 0.1);
      const backMesh = new THREE.Mesh(backGeo, chairMaterial);
      backMesh.position.set(0, 0.81, -0.9);
      backMesh.rotation.x = -0.08;
      backMesh.castShadow = true;
      chair.add(backMesh);

      /* Backrest top rail */
      const railGeo = new THREE.BoxGeometry(2.2, 0.08, 0.16);
      const railMesh = new THREE.Mesh(railGeo, accentMaterial);
      railMesh.position.set(0, 1.57, -0.9);
      chair.add(railMesh);

      /* Backrest vertical ribs */
      for (let i = -3; i <= 3; i++) {
        const ribGeo = new THREE.BoxGeometry(0.08, 1.3, 0.04);
        const rib = new THREE.Mesh(ribGeo, legMaterial);
        rib.position.set(i * 0.28, 0.75, -0.86);
        rib.rotation.x = -0.08;
        chair.add(rib);
      }

      /* --- ARMRESTS --- */
      const armGeo = new THREE.BoxGeometry(0.18, 0.06, 1.5);
      const armMat = chairMaterial;

      const leftArm = new THREE.Mesh(armGeo, armMat);
      leftArm.position.set(-1.1, 0.45, -0.15);
      leftArm.castShadow = true;
      chair.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, armMat);
      rightArm.position.set(1.1, 0.45, -0.15);
      rightArm.castShadow = true;
      chair.add(rightArm);

      /* Armrest supports */
      const armSuppGeo = new THREE.BoxGeometry(0.1, 0.46, 0.1);
      [-1.1, 1.1].forEach(x => {
        [-0.8, 0.4].forEach(z => {
          const supp = new THREE.Mesh(armSuppGeo, legMaterial);
          supp.position.set(x, 0.23, z);
          chair.add(supp);
        });
      });

      /* --- LEGS --- */
      const legGeo = new THREE.BoxGeometry(0.12, 1.1, 0.12);
      const legPositions = [
        [-0.95, -0.55, -0.8],
        [ 0.95, -0.55, -0.8],
        [-0.95, -0.55,  0.8],
        [ 0.95, -0.55,  0.8],
      ];
      legPositions.forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(legGeo, legMaterial);
        leg.position.set(x, y, z);
        leg.castShadow = true;
        chair.add(leg);
      });

      /* Cross stretcher between front legs */
      const stretchGeo = new THREE.BoxGeometry(1.78, 0.08, 0.08);
      const stretchF = new THREE.Mesh(stretchGeo, legMaterial);
      stretchF.position.set(0, -0.9, 0.8);
      chair.add(stretchF);

      const stretchB = new THREE.Mesh(stretchGeo, legMaterial);
      stretchB.position.set(0, -0.9, -0.8);
      chair.add(stretchB);

      /* Leg bottoms — small rubber feet */
      const footGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.06, 8);
      const footMat = new THREE.MeshStandardMaterial({ color: 0x0A0A0A, roughness: 0.9 });
      legPositions.forEach(([x, , z]) => {
        const foot = new THREE.Mesh(footGeo, footMat);
        foot.position.set(x, -1.13, z);
        chair.add(foot);
      });

      return chair;
    }

    const chair = buildChair();
    chair.scale.set(0.7, 0.7, 0.7);
    chair.position.y = -0.2;
    product.add(chair);

    /* ── GROUND SHADOW PLANE ── */
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.0;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ── PARTICLE FIELD — floating dust/material particles ── */
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sizes[i] = Math.random() * 0.03 + 0.005;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xC8102E,
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ── MOUSE / TOUCH TRACKING ── */
    let targetRotY  = 0;
    let currentRotY = 0;
    let targetRotX  = 0.08;
    let currentRotX = 0.08;
    let mouseNX = 0, mouseNY = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let dragRotY = 0;

    document.addEventListener('mousemove', e => {
      if (!isDragging) {
        mouseNX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
        targetRotY = mouseNX * 0.3;
        targetRotX = 0.08 + mouseNY * 0.1;
      }
    });

    canvas.addEventListener('mousedown', e => {
      isDragging = true;
      lastPointerX = e.clientX;
      canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      canvas.style.cursor = 'none';
    });

    window.addEventListener('mousemove', e => {
      if (isDragging) {
        const dx = e.clientX - lastPointerX;
        dragRotY += dx * 0.008;
        lastPointerX = e.clientX;
      }
    });

    /* Touch */
    let touchStartX = 0;
    canvas.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    });
    canvas.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - touchStartX;
      dragRotY += dx * 0.006;
      touchStartX = e.touches[0].clientX;
      e.preventDefault();
    }, { passive: false });

    /* Scroll response */
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      scrollProgress = Math.min(window.scrollY / hero.offsetHeight, 1);
    }, { passive: true });

    /* ── ANIMATION LOOP ── */
    const clock = new THREE.Clock();
    const lerpFactor = 0.06;

    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      /* Auto-rotation when not dragging */
      if (!isDragging) {
        dragRotY += 0.003;
      }

      /* Smooth camera parallax */
      currentRotY = currentRotY + (targetRotY - currentRotY) * 0.08;
      currentRotX = currentRotX + (targetRotX - currentRotX) * 0.08;

      /* Apply rotations */
      product.rotation.y = dragRotY + currentRotY;
      product.rotation.x = currentRotX;

      /* Scroll: tilt and move chair up as user scrolls */
      product.position.y = -0.2 + scrollProgress * 0.8;
      camera.position.z = 6 - scrollProgress * 1.5;

      /* Gentle float */
      product.position.y += Math.sin(t * 0.8) * 0.04;

      /* Rim light pulsing */
      rimLight.intensity = 1.5 + Math.sin(t * 1.2) * 0.3;

      /* Particle drift */
      const posArr = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += 0.003;
        if (posArr[i * 3 + 1] > 3) posArr[i * 3 + 1] = -3;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    /* ── RESIZE ── */
    window.addEventListener('resize', () => {
      const W = canvas.clientWidth  || window.innerWidth;
      const H = canvas.clientHeight || window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });

    /* ── ENTRANCE ANIMATION ── */
    /* Chair starts scaled down and fades in */
    chair.scale.set(0, 0, 0);
    let enterProgress = 0;

    function enterAnim() {
      if (enterProgress < 1) {
        enterProgress += 0.015;
        const eased = 1 - Math.pow(1 - enterProgress, 3);
        const scale = 0.7 * eased;
        chair.scale.set(scale, scale, scale);
        requestAnimationFrame(enterAnim);
      }
    }

    setTimeout(enterAnim, 400);

    console.log('[NPPL 3D] Hero scene initialized.');
  }

})();
