class Mapa {
  constructor(options = {}) {
    const rootEl = document.getElementById("mapa");
    if (!rootEl) throw new Error(`Can't find root element`);

    this.cols = options.columns;
    this.rows = options.rows;

    this.root = rootEl;
    this.posx = 0;
    this.poxy = 0;
    this.directions = ["up", "down", "left", "right"];

    this.setTiles();
    this.setArrows();
    if (options.nav !== false) this.createMinimap();

    this.setCurrentTile(this.getFirstValidTile());
  }

  setTiles() {
    const tiles = document.getElementsByClassName("mapa-tile");

    this.cols = this.columns || Math.ceil(Math.sqrt(tiles.length));
    this.rows = this.rows || Math.floor(Math.sqrt(tiles.length));

    this.tiles = [...tiles].reduce(
      (acum, tile) => {
        const lastRow = acum[acum.length - 1];

        if (lastRow.length < this.cols) {
          lastRow.push(tile);
        } else {
          acum.push([tile]);
        }

        return acum;
      },
      [[]]
    );
  }

  setArrows() {
    this.directions.forEach(dir => {
      const arrow = document.createElement("div");
      arrow.classList.add(
        "mapa-arrow",
        `arrow-${dir}`,
        "animated",
        "heartbeat"
      );
      arrow.innerHTML = `<i class="fas fa-angle-${dir}"></i>`;

      arrow.onclick = () => this.go(dir);

      this.root.appendChild(arrow);
    });
  }

  getFirstValidTile() {
    const x = this.tiles.findIndex(row => row.some(tile => !!tile.innerHTML));
    const y = this.tiles[x].findIndex(tile => !!tile.innerHTML);

    return [x, y];
  }

  setCurrentTile([x, y]) {
    this.posx = x;
    this.posy = y;

    if (this.currentTile) this.currentTile.classList.remove("active");

    this.currentTile = this.tiles[this.posx][this.posy];
    this.currentTile.classList.add("active");

    if (this.map) this.setCurrentTileMinimap();
    this.updateArrows();
  }

  createMinimap() {
    this.map = document.createElement("div");
    this.map.id = "mapa-nav";

    this.tiles.forEach((row, x) => {
      const div = document.createElement("div");
      div.classList.add("mapa-nav__row");

      row.forEach((el, y) => {
        const mapTile = document.createElement("div");

        if (el.innerHTML) {
          mapTile.classList.add("mapa-nav__block");
          mapTile.onclick = () => this.setCurrentTile([x, y]);
        }

        div.appendChild(mapTile);
      });

      this.map.appendChild(div);
    });

    this.root.appendChild(this.map);
  }

  setCurrentTileMinimap() {
    const oldTile = document.querySelector(".mapa-nav__block.active");
    if (oldTile) oldTile.classList.remove("active");

    const currentTile = this.map.childNodes[this.posx].childNodes[this.posy];
    currentTile.classList.add("active");
  }

  updateArrows() {
    this.directions.forEach(dir => {
      const el = document.querySelector(`.arrow-${dir}`);
      this.canGo(dir) ? el.classList.remove("hide") : el.classList.add("hide");
    });
  }

  go(dir) {
    switch (dir) {
      case "up":
        return this.setCurrentTile([this.posx - 1, this.posy]);

      case "down":
        return this.setCurrentTile([this.posx + 1, this.posy]);

      case "left":
        return this.setCurrentTile([this.posx, this.posy - 1]);

      case "right":
        return this.setCurrentTile([this.posx, this.posy + 1]);
    }

    setCurrentTile();
  }

  canGo(dir) {
    switch (dir) {
      case "up":
        if (this.posx === 0) return false;
        return !!this.tiles[this.posx - 1][this.posy].innerHTML;

      case "down":
        if (this.posx === this.tiles.length - 1) return false;
        return !!this.tiles[this.posx + 1][this.posy].innerHTML;

      case "left":
        if (this.posy === 0) return false;
        return !!this.tiles[this.posx][this.posy - 1].innerHTML;

      case "right":
        if (this.posy === this.tiles[this.posx].length - 1) return false;
        return !!this.tiles[this.posx][this.posy + 1].innerHTML;
    }
  }
}

const App = new Mapa({});
App.setTiles();
