// ============================================================
// CyberQuest — Three.js 3D World Engine
// ============================================================
const WorldEngine = {
  scene: null, camera: null, renderer: null,
  raycaster: null, mouse: new THREE.Vector2(),
  buildings: [], clock: null,
  camTheta: Math.PI/5, camPhi: Math.PI/3.5, camRadius: 52,
  camTarget: new THREE.Vector3(0,0,0),
  isDragging: false, lastMouse: {x:0,y:0},
  _particles: null, _heroRing: null, _stars: null,

  ZONES: [
    { id:'game-alex',     name:'📖 Noob District — Alex\'s Story',   color:0xff6600, ecolor:0x441100, pos:[-14,0,-14], size:[7,10,7]  },
    { id:'game-password', name:'🔐 Password Fortress',                color:0x0055ff, ecolor:0x001144, pos:[14,0,-14],  size:[7,12,7]  },
    { id:'game-phishing', name:'🎣 Phishing Lake',                    color:0x00cc55, ecolor:0x003311, pos:[-14,0,14],  size:[8,8,8]   },
    { id:'game-malware',  name:'🌀 Malware Maze',                     color:0x9900ff, ecolor:0x220044, pos:[14,0,14],   size:[8,9,8]   },
    { id:'game-social',   name:'🔒 Social Media Square',              color:0x00cccc, ecolor:0x002233, pos:[-5,0,-20],  size:[7,8,7]   },
    { id:'game-hero',     name:'🦸 CyberHero HQ — Final Challenge',   color:0xffcc00, ecolor:0x443300, pos:[0,0,0],    size:[6,16,6]  },
  ],

  init() {
    const canvas = document.getElementById('world-canvas');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020810);
    this.scene.fog = new THREE.FogExp2(0x020810, 0.016);
    this.camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 500);
    this.renderer = new THREE.WebGLRenderer({canvas, antialias:true});
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    this.renderer.shadowMap.enabled = true;
    this.raycaster = new THREE.Raycaster();
    this.clock = new THREE.Clock();
    this.updateCamera();
    this.buildScene();
    this.bindEvents(canvas);
    this.animate();
  },

  updateCamera() {
    const x = this.camRadius * Math.sin(this.camPhi) * Math.sin(this.camTheta);
    const y = this.camRadius * Math.cos(this.camPhi);
    const z = this.camRadius * Math.sin(this.camPhi) * Math.cos(this.camTheta);
    this.camera.position.set(this.camTarget.x+x, this.camTarget.y+y, this.camTarget.z+z);
    this.camera.lookAt(this.camTarget);
  },

  buildScene() {
    this.addLights();
    this.addGround();
    this.addStars();
    this.addBuildings();
    this.addRoads();
    this.addLamps();
    this.addTrees();
    this.addParticles();
  },

  addLights() {
    this.scene.add(new THREE.AmbientLight(0x112233, 0.6));
    const sun = new THREE.DirectionalLight(0x6688cc, 1.0);
    sun.position.set(30,50,20); sun.castShadow = true;
    sun.shadow.mapSize.set(2048,2048);
    sun.shadow.camera.left = sun.shadow.camera.bottom = -70;
    sun.shadow.camera.right = sun.shadow.camera.top = 70;
    this.scene.add(sun);
    // Corner accent lights
    [[-20,4,-20,0x00ffff],[20,4,-20,0xff0088],[-20,4,20,0x8800ff],[20,4,20,0x00ff44]].forEach(([x,y,z,c])=>{
      const l = new THREE.PointLight(c,1.0,28); l.position.set(x,y,z); this.scene.add(l);
    });
    const spot = new THREE.SpotLight(0xffcc00,2,60,Math.PI/7,0.4);
    spot.position.set(0,35,0); spot.target.position.set(0,0,0);
    this.scene.add(spot); this.scene.add(spot.target);
  },

  addGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(130,130,1,1),
      new THREE.MeshLambertMaterial({color:0x040c1a})
    );
    ground.rotation.x = -Math.PI/2; ground.receiveShadow = true;
    this.scene.add(ground);
    const grid = new THREE.GridHelper(130,45,0x003366,0x001133);
    grid.position.y = 0.02; this.scene.add(grid);
    // Hero HQ platform
    const plat = new THREE.Mesh(new THREE.CylinderGeometry(9,9,0.4,48), new THREE.MeshLambertMaterial({color:0x111133}));
    plat.position.y = 0.2; this.scene.add(plat);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(9,0.12,8,80), new THREE.MeshBasicMaterial({color:0xffcc00}));
    ring.rotation.x = Math.PI/2; ring.position.y = 0.42; this.scene.add(ring);
    this._heroRing = ring;
  },

  addStars() {
    const n=1800, pos=new Float32Array(n*3);
    for(let i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*500;pos[i*3+1]=60+Math.random()*180;pos[i*3+2]=(Math.random()-.5)*500;}
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    this._stars = new THREE.Points(g, new THREE.PointsMaterial({color:0xaaccff,size:0.35,transparent:true,opacity:0.8}));
    this.scene.add(this._stars);
  },

  addBuildings() {
    this.buildings = [];
    this.ZONES.forEach(z => {
      const group = new THREE.Group();
      group.position.set(z.pos[0],0,z.pos[2]);
      group.userData = {zoneId:z.id, zoneName:z.name};

      // Main body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(...z.size),
        new THREE.MeshLambertMaterial({color:z.color})
      );
      body.position.y = z.size[1]/2;
      body.castShadow = true; body.receiveShadow = true;
      body.userData = {zoneId:z.id, zoneName:z.name, isBuilding:true};
      group.add(body);

      // Wireframe glow overlay
      const wireMat = new THREE.MeshBasicMaterial({color:z.color,wireframe:true,transparent:true,opacity:0.25});
      const wire = new THREE.Mesh(new THREE.BoxGeometry(z.size[0]+0.2,z.size[1]+0.2,z.size[2]+0.2), wireMat);
      wire.position.y = z.size[1]/2; group.add(wire);

      // Roof cap
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(z.size[0]+0.6,0.5,z.size[2]+0.6),
        new THREE.MeshBasicMaterial({color:z.color})
      );
      roof.position.y = z.size[1]+0.25; group.add(roof);

      // Windows
      const rows = Math.floor(z.size[1]/2.8);
      for(let r=1;r<=rows;r++){
        for(let c=-1;c<=1;c++){
          const lit = Math.random()>0.3;
          const wMat = new THREE.MeshBasicMaterial({color: lit?z.color:0x111122, transparent:true, opacity:lit?0.9:0.4});
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.9,0.08), wMat);
          win.position.set(c*2, r*2.5, z.size[2]/2+0.05); group.add(win);
          const win2 = win.clone(); win2.position.z = -z.size[2]/2-0.05; group.add(win2);
        }
      }

      this.scene.add(group);
      this.buildings.push({group, body, wireMat, z});
    });
  },

  addRoads() {
    const mat = new THREE.MeshLambertMaterial({color:0x080e1a});
    const hR = new THREE.Mesh(new THREE.PlaneGeometry(100,7), mat);
    hR.rotation.x=-Math.PI/2; hR.position.y=0.03; this.scene.add(hR);
    const vR = new THREE.Mesh(new THREE.PlaneGeometry(7,100), mat);
    vR.rotation.x=-Math.PI/2; vR.position.y=0.03; this.scene.add(vR);
    // Center dashes
    for(let i=-40;i<=40;i+=6){
      const dMat = new THREE.MeshBasicMaterial({color:0xffcc00,transparent:true,opacity:0.5});
      const dh = new THREE.Mesh(new THREE.PlaneGeometry(3,0.2),dMat);
      dh.rotation.x=-Math.PI/2; dh.position.set(i,0.04,0); this.scene.add(dh);
      const dv=dh.clone(); dv.rotation.z=Math.PI/2; dv.position.set(0,0.04,i); this.scene.add(dv);
    }
  },

  addLamps() {
    [[-9,0,-9],[9,0,-9],[-9,0,9],[9,0,9],[-22,0,0],[22,0,0],[0,0,-22],[0,0,22]].forEach(([x,,z])=>{
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,6,8), new THREE.MeshLambertMaterial({color:0x334455}));
      post.position.set(x,3,z); this.scene.add(post);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.38,8,8), new THREE.MeshBasicMaterial({color:0x00ffff}));
      head.position.set(x,6.3,z); this.scene.add(head);
      const pl = new THREE.PointLight(0x00ffff,0.5,14); pl.position.set(x,6,z); this.scene.add(pl);
    });
  },

  addTrees() {
    [[-26,0,-26],[26,0,-26],[-26,0,26],[26,0,26],[-12,0,-26],[12,0,-26],[-26,0,12],[26,0,12]].forEach(([x,,z])=>{
      const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,2,6),new THREE.MeshLambertMaterial({color:0x442211}));
      trunk.position.set(x,1,z); this.scene.add(trunk);
      const crown=new THREE.Mesh(new THREE.ConeGeometry(2.2,4.5,7),new THREE.MeshLambertMaterial({color:0x004422}));
      crown.position.set(x,4.5,z); this.scene.add(crown);
    });
  },

  addParticles() {
    const n=400; const pos=new Float32Array(n*3); const col=new Float32Array(n*3);
    for(let i=0;i<n;i++){
      pos[i*3]=(Math.random()-.5)*90; pos[i*3+1]=1+Math.random()*18; pos[i*3+2]=(Math.random()-.5)*90;
      const t=Math.random(); col[i*3]=t>0.5?0:0.5; col[i*3+1]=t>0.5?1:0.8; col[i*3+2]=1;
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    g.setAttribute('color',new THREE.BufferAttribute(col,3));
    this._particles=new THREE.Points(g, new THREE.PointsMaterial({size:0.22,vertexColors:true,transparent:true,opacity:0.7}));
    this._particlePos=pos;
    this.scene.add(this._particles);
  },

  bindEvents(canvas) {
    canvas.addEventListener('mousedown', e=>{this.isDragging=true; this.lastMouse={x:e.clientX,y:e.clientY};});
    window.addEventListener('mouseup',   ()=>{this.isDragging=false;});
    window.addEventListener('mousemove', e=>{
      this.mouse.x=(e.clientX/innerWidth)*2-1;
      this.mouse.y=-(e.clientY/innerHeight)*2+1;
      if(this.isDragging){
        this.camTheta-=(e.clientX-this.lastMouse.x)*0.008;
        this.camPhi=Math.max(0.25,Math.min(1.35,this.camPhi+(e.clientY-this.lastMouse.y)*0.008));
        this.lastMouse={x:e.clientX,y:e.clientY};
        this.updateCamera();
      }
    });
    window.addEventListener('wheel', e=>{
      this.camRadius=Math.max(18,Math.min(85,this.camRadius+e.deltaY*0.05));
      this.updateCamera();
    });
    // Touch support
    let lastTouch=null;
    canvas.addEventListener('touchstart',e=>{lastTouch=e.touches[0]; this.isDragging=true;});
    canvas.addEventListener('touchend',  ()=>{this.isDragging=false;});
    canvas.addEventListener('touchmove', e=>{
      if(!lastTouch) return;
      const t=e.touches[0];
      this.camTheta-=(t.clientX-lastTouch.clientX)*0.01;
      this.camPhi=Math.max(0.25,Math.min(1.35,this.camPhi+(t.clientY-lastTouch.clientY)*0.01));
      lastTouch=t; this.updateCamera(); e.preventDefault();
    },{passive:false});

    canvas.addEventListener('click', e=>{
      if(Math.abs(e.clientX-this.lastMouse.x)>8) return;
      this.checkClick();
    });
    window.addEventListener('resize',()=>{
      this.camera.aspect=innerWidth/innerHeight; this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth,innerHeight);
    });
  },

  checkClick() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes=[];
    this.buildings.forEach(b=>b.group.traverse(c=>{if(c.isMesh)meshes.push(c);}));
    const hits=this.raycaster.intersectObjects(meshes);
    if(hits.length){
      let obj=hits[0].object;
      while(obj && !obj.userData.zoneId) obj=obj.parent;
      const id=obj?.userData?.zoneId;
      if(id && typeof openGame==='function') openGame(id);
    }
  },

  animate() {
    this.animationId = requestAnimationFrame(()=>this.animate());
    const t=this.clock.getElapsedTime();

    // Hover detection + glow
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes=[];
    this.buildings.forEach(b=>b.group.traverse(c=>{if(c.isMesh)meshes.push(c);}));
    const hits=this.raycaster.intersectObjects(meshes);
    let hoveredId=null;
    if(hits.length){
      let obj=hits[0].object;
      while(obj&&!obj.userData.zoneId) obj=obj.parent;
      hoveredId=obj?.userData?.zoneId;
    }
    this.buildings.forEach(b=>{
      const isHovered = b.z.id===hoveredId;
      b.wireMat.opacity = isHovered ? 0.7 : 0.25;
      b.group.scale.y = isHovered ? 1+Math.sin(t*3)*0.01 : 1;
      if(isHovered && typeof showZoneLabel==='function') showZoneLabel(b.z.name);
    });
    if(!hoveredId && typeof hideZoneLabel==='function') hideZoneLabel();

    // Animate particles
    if(this._particles&&this._particlePos){
      const pos=this._particlePos;
      for(let i=0;i<pos.length/3;i++){
        pos[i*3+1]+=0.015;
        if(pos[i*3+1]>20) pos[i*3+1]=1;
      }
      this._particles.geometry.attributes.position.needsUpdate=true;
    }

    // Spin hero ring
    if(this._heroRing) this._heroRing.rotation.z=t*0.8;

    // Twinkle stars
    if(this._stars) this._stars.material.opacity=0.6+Math.sin(t*0.5)*0.2;

    this.renderer.render(this.scene, this.camera);
  }
};
