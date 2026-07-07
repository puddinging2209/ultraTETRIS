// １ブロックの大きさ
const block_size = 30;
const holdzone_blocksize = 20;

// 落下速度
let dropping_speed = 500;

// フィールドのマス数
const playscreen_width = 10;
const playscreen_height = 20;
const holdzone_block = 4;

// 得点
const scores = [200, 400, 600, 1000];
const Tspin_scores = [500, 1000, 1500];
// キャンバスid取得
const $canvas = document.getElementById('canvas');
const $hold = document.getElementById('holdzone');
// 2dコンテキスト取得
const $canvas_2d = $canvas.getContext('2d');
const $hold_2d = $hold.getContext('2d');

// キャンバスサイズ指定
const canvas_width = block_size * playscreen_width;
const canvas_height = block_size * playscreen_height;
const holdzone_width = holdzone_blocksize * holdzone_block;
const holdzone_height = canvas_height;
$canvas.width = canvas_width;
$canvas.height = canvas_height;
$hold.width = holdzone_width;
$hold.height = holdzone_height;

// 最大ミノの長辺
const max_size = 4;

// 変数の定義
let x = 0;
let y = 0;
let moved_mino = [];
let moved_minoColor = null;
let loop;
let score = 0;
let clearedline = 0;
let highscore = localStorage.getItem('highscore') ?? 0;
let nowmino;
let nowmino_color;
let holdmino;
let default_bag = [0, 1, 2, 3, 4, 5, 6];
let bag = default_bag.slice();
let mino_number = null;
let nowmino_number;
let holdOK = true;
let nexts = [];
let nextsColors = [];
let block_color = [];
let perfect = false;
let mino_direction = 0;
let moved_direction = null;
let srs_position = [0, 0];
let TETRIS = 0;
let Tspin = false;
let Tspin_chance = false;
let Tspin_count = 0;
let Tspin_timer = 0;
let BtoB = false;
let BtoBchance = false;
let ren = 0;
let pause = false;
let cannotmove_counter = 0;
let justdropped = [];
let inputs = [];
let KONAMImode = false;
let KONAMIcount = 0;
let dropping_block = [];
let puyogroups = [];
let justdroppuyo = [];
let scrolling;
let BPM;
let measure = 0;
let rhythm;
let time;

const minos = [
	[[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], 'red'],
	[[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], 'lime'],
	[[0, 0, 0, 0], [1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], 'blue'],
	[[0, 0, 0, 0], [0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], 'Orange'],
	[[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], 'purple'],
	[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], 'aqua'],
	[[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], 'yellow'],
];

const KONAMIcommand = '["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"]';

const puyopuyoColors = ['red', 'blue', 'green', 'yellow'];

const Keyboards = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];

// SRS
const to1 = [
	[0, 0],
	[-1, 0],
	[-1, -1],
	[0, 2],
	[-1, 2],
];
const from1to2 = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, -2],
	[1, -2],
];
const from3to2 = [
	[0, 0],
	[-1, 0],
	[-1, 1],
	[0, -2],
	[-1, -2],
];
const to3 = [
	[0, 0],
	[1, 0],
	[1, -1],
	[0, 2],
	[1, 2],
];
const from3to0 = [
	[0, 0],
	[-1, 0],
	[-1, 1],
	[0, -2],
	[-1, -2],
];
const from1to0 = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, -2],
	[1, -2],
];

const I_from0to1 = [
	[0, 0],
	[-2, 0],
	[1, 0],
	[-2, 1],
	[1, -2],
];
const I_from1to2 = [
	[0, 0],
	[-1, 0],
	[2, 0],
	[-1, -2],
	[2, 1],
];
const I_from2to3 = [
	[0, 0],
	[2, 0],
	[-1, 0],
	[2, -1],
	[-1, 2],
];
const I_from3to0 = [
	[0, 0],
	[1, 0],
	[-2, 0],
	[1, 2],
	[-2, -1],
];

const I_from0to3 = [
	[0, 0],
	[-1, 0],
	[2, 0],
	[-1, -2],
	[2, 1],
];
const I_from3to2 = [
	[0, 0],
	[-2, 0],
	[1, 0],
	[-2, 1],
	[1, -2],
];
const I_from2to1 = [
	[0, 0],
	[1, 0],
	[-2, 0],
	[1, 2],
	[-2, -1],
];
const I_from1to0 = [
	[0, 0],
	[2, 0],
	[-1, 0],
	[2, -1],
	[-1, 2],
];

const magic_mino = [
	[0, 0],
	[1, 0],
	[-1, 0],
	[2, 0],
	[-2, 0],
];

// ミノの移動距離
let mino_distanceX = 0;
let mino_distanceY = 0;

const draw_block = (area, x, y, color, fill = true, stroke_color = 'black') => {
	let drawX;
	let drawY;
	let drawing_blocksize;
	switch (area) {
		case $canvas_2d:
			drawX = x * block_size;
			drawY = y * block_size;
			drawing_blocksize = block_size;
			break;

		case $hold_2d:
			drawX = x * holdzone_blocksize;
			drawY = y * holdzone_blocksize;
			drawing_blocksize = holdzone_blocksize;
			break;
	}
	if (fill) {
		// 色を指定
		area.fillStyle = color;
		area.fillRect(drawX, drawY, drawing_blocksize, drawing_blocksize);
	}
	// 線の色を黒に
	area.strokeStyle = stroke_color;
	area.strokeRect(drawX, drawY, drawing_blocksize, drawing_blocksize);
};

// 画面本体
let screen = [];

// ゲームオーバーフラグ
let gameover = false;

// プレイ画面描画
const draw_playscreen = (draw_ghost) => {
	// 背景色を黒に指定
	$canvas_2d.fillStyle = 'black';
	$hold_2d.fillStyle = 'black';

	// 背景を塗りつぶす
	$canvas_2d.fillRect(0, 0, canvas_width, canvas_height);
	$hold_2d.fillRect(0, 0, holdzone_width, holdzone_height);

	// 積みを描画
	for (let y = 0; y < playscreen_height; y++) {
		for (let x = 0; x < playscreen_width; x++) {
			if (screen[y][x] === 1 || (KONAMImode === 9 && block_color[y][x])) {
				if (!JSON.stringify(justdropped).includes(JSON.stringify([x, y]))) {
					if (KONAMImode !== 4 || gameover) {
						draw_block($canvas_2d, x, y, block_color[y][x]);
					} else {
						draw_block($canvas_2d, x, y, 'black', false);
					}
				} else {
					draw_block($canvas_2d, x, y, 'white');
				}
			}
		}
	}

	if (KONAMImode !== 9) {
		// ゴーストの描画
		if (dropping_block.length !== 0 ? false : draw_ghost) {
			let ghost_positionY = 0;
			while (can_move(0, ghost_positionY, nowmino)) {
				ghost_positionY++;
			}
			y = 0;
			while (y < max_size) {
				x = 0;
				while (x < max_size) {
					if (nowmino[y][x] === 1) {
						draw_block($canvas_2d, mino_distanceX + x, mino_distanceY + ghost_positionY + y - 1, null, false, 'gray');
					}
					x++;
				}
				y++;
			}
		}

		// ミノを描画
		if (KONAMImode !== 8 || dropping_block.length === 0) {
			for (let y = 0; y < max_size; y++) {
				for (let x = 0; x < max_size; x++) {
					if (nowmino[y][x] === 1) {
						if (KONAMImode !== 8) {
							draw_block($canvas_2d, mino_distanceX + x, mino_distanceY + y, nowmino[4]);
						} else {
							draw_block($canvas_2d, mino_distanceX + x, mino_distanceY + y, nowmino_color[y][x]);
						}
					}
				}
			}
		}
	}

	// HOLDミノを描画
	if (holdmino) {
		y = 0;
		while (y < max_size) {
			x = 0;
			while (x < max_size) {
				if (holdmino[y][x] === 1) {
					if (holdOK) {
						draw_block($hold_2d, x, y + 1, holdmino[4]);
					} else {
						draw_block($hold_2d, x, y + 1, 'gray');
					}
				}
				x++;
			}
			y++;
		}
	}

	// NEXTミノを描画
	let counter = 0;
	while (counter < nexts.length) {
		y = 0;
		while (y < max_size) {
			x = 0;
			while (x < max_size) {
				if (nexts[counter][y][x] === 1) {
					if (KONAMImode !== 8) {
						draw_block($hold_2d, x, (counter + 1) * 4 + y + 2, nexts[counter][4]);
					} else {
						draw_block($hold_2d, x, (counter + 1) * 4 + y + 2, nextsColors[counter][y][x]);
					}
				}
				x++;
			}
			y++;
		}
		counter++;
	}

	// ぷよ描画
	if (KONAMImode === 8 || KONAMImode === 9) {
		for (let i = 0; i < dropping_block.length; i++) {
			const dropping = dropping_block[i];
			draw_block($canvas_2d, dropping.x, dropping.y, dropping.color);
		}
	}

	// テキスト表示
	$canvas_2d.fillStyle = 'white';
	$canvas_2d.font = "bold 20px 'Meiryo UI'";
	$canvas_2d.fillText('score:' + score, 10, 25);

	let highscore_width = $canvas_2d.measureText('high:' + highscore).width;
	$canvas_2d.fillText('high:' + highscore, canvas_width - 10 - highscore_width, 25);
	if (KONAMImode !== 9) {
		if (KONAMImode !== 8) {
			$canvas_2d.fillText('lines:' + clearedline, 10, 55);
		} else {
			$canvas_2d.fillText('puyos:' + clearedline, 10, 55);
		}

		$hold_2d.fillStyle = 'white';
		$hold_2d.font = "20px 'Meiryo UI'";
		const holdtextwidth = $hold_2d.measureText('HOLD').width;
		const nexttextwidth = $hold_2d.measureText('NEXT').width;
		if (KONAMImode !== 8) $hold_2d.fillText('HOLD', holdzone_width / 2 - holdtextwidth / 2, 25);
		$hold_2d.fillText('NEXT', holdzone_width / 2 - nexttextwidth / 2, 115);
	}

	if (perfect) {
		const perfect_message = 'PERFECT\nCLEAR';
		$canvas_2d.font = "bold 50px 'Meiryo UI'";
		$canvas_2d.fillStyle = 'yellow';
		const lines = perfect_message.split('\n');
		lines.forEach((line, index) => {
			const perfect_textwidth = $canvas_2d.measureText(line).width;
			$canvas_2d.fillText(line, canvas_width / 2 - perfect_textwidth / 2, canvas_height / 2 + index * 45);
		});
	}

	if (TETRIS > 0) {
		$canvas_2d.font = "bold 50px 'Meiryo UI'";
		$canvas_2d.fillStyle = 'yellow';
		$canvas_2d.fillText('TETRIS', canvas_width / 2 - $canvas_2d.measureText('TETRIS').width / 2, canvas_height / 2 + 40);
		TETRIS--;
	}

	if (Tspin_timer > 0) {
		let Tspin_message;
		switch (true) {
			case Tspin_count === 0:
				Tspin_message = 'Tspin';
				$canvas_2d.fillStyle = 'white';
				break;
			case Tspin_count === 1:
				Tspin_message = 'Tspin-Single';
				$canvas_2d.fillStyle = 'yellow';
				break;
			case Tspin_count === 2:
				Tspin_message = 'Tspin-Double';
				$canvas_2d.fillStyle = 'yellow';
				break;
			case Tspin_count === 3:
				Tspin_message = 'Tspin-Triple';
				$canvas_2d.fillStyle = 'yellow';
				break;
		}

		$canvas_2d.font = "bold 30px 'Meiryo UI'";
		let Tspin_message_width = $canvas_2d.measureText(Tspin_message).width;
		$canvas_2d.fillText(Tspin_message, canvas_width / 2 - Tspin_message_width / 2, canvas_height / 2 + 40);
		Tspin_timer--;
	}

	if (BtoB) {
		$canvas_2d.fillStyle = 'yellow';
		$canvas_2d.font = "bold 20px 'Meiryo UI'";
		$canvas_2d.fillText('BACKtoBACK', canvas_width - 10 - $canvas_2d.measureText('BACKtoBACK').width, 85);
	}

	if (ren > 1) {
		$canvas_2d.fillStyle = 'yellow';
		$canvas_2d.font = "bold 20px 'Meiryo UI'";
		$canvas_2d.fillText(ren + ' REN', 10, 85);
	}

	if (KONAMIcount) {
		const KONAMI_message = `KONAMI #${KONAMImode}`;
		$canvas_2d.font = "bold 44px 'Meiryo UI'";
		let KONAMI_width = $canvas_2d.measureText(KONAMI_message).width;
		$canvas_2d.fillStyle = 'yellow';
		$canvas_2d.fillText(KONAMI_message, canvas_width / 2 - KONAMI_width / 2 - 2, canvas_height / 2 - 2);
		KONAMIcount--;
	}

	if (pause) {
		const pause_message = 'pause';
		$canvas_2d.font = "bold 44px 'Meiryo UI'";
		let pause_width = $canvas_2d.measureText(pause_message).width;
		$canvas_2d.fillStyle = 'black';
		$canvas_2d.fillText(pause_message, canvas_width / 2 - pause_width / 2 - 2, canvas_height / 2 - 2);

		$canvas_2d.font = "bold 40px 'Meiryo UI'";
		pause_width = $canvas_2d.measureText(pause_message).width;
		$canvas_2d.fillStyle = 'white';
		$canvas_2d.fillText(pause_message, canvas_width / 2 - pause_width / 2, canvas_height / 2);
	}

	// ゲームオーバー描画
	if (gameover) {
		$canvas_2d.fillStyle = 'black';
		$canvas_2d.fillRect(0, 250, canvas_width, 100);

		const gameover_massage = 'GAME OVER';
		$canvas_2d.font = "bold 40px 'Meiryo UI'";
		const text_width = $canvas_2d.measureText(gameover_massage).width;
		$canvas_2d.fillStyle = 'red';
		$canvas_2d.fillText(gameover_massage, canvas_width / 2 - text_width / 2, canvas_height / 2);

		const retry_massage = 'Press Enter to Continue';
		$canvas_2d.font = "bold 20px 'Meiryo UI'";
		const retry_width = $canvas_2d.measureText(retry_massage).width;
		$canvas_2d.fillText(retry_massage, canvas_width / 2 - retry_width / 2, canvas_height / 2 + 40);

		if (score === highscore) {
			const highscore_massage = 'High SCORE!';
			$canvas_2d.fillStyle = 'yellow';
			$canvas_2d.font = "bold 30px 'Meiryo UI'";
			const highscore_message_width = $canvas_2d.measureText(highscore_massage).width;
			$canvas_2d.fillText(highscore_massage, canvas_width / 2 - highscore_message_width / 2, canvas_height / 2 - 50);
		}
	}

	// 音ゲーキーボード
	if (KONAMImode === 9) {
		$canvas_2d.fillStyle = 'black';
		$canvas_2d.font = "20px 'Meiryo UI'";
		const y = block_size * 19 - 5;
		Keyboards.forEach((value, index) => {
			const x = block_size / 2 - $canvas_2d.measureText(value).width / 2;
			$canvas_2d.fillText(value, block_size * index + x, y);
		});
	}
};

const can_move = (moveX, moveY, moved_mino) => {
	y = 0;
	while (y < max_size) {
		x = 0;
		while (x < max_size) {
			if (moved_mino[y][x] === 1) {
				// 移動後の位置
				let nextX = mino_distanceX + x + moveX;
				let nextY = mino_distanceY + y + moveY;

				// 移動後にあるか判定
				if (nextY < -3 || nextX < 0 || nextY >= playscreen_height || nextX >= playscreen_width || (nextY > 0 && screen[nextY][nextX] === 1)) {
					return false;
				}
			}
			x++;
		}
		y++;
	}
	return true;
};

// 右回転
const right_rotated = (mino, number = nowmino_number) => {
	// 回転後のミノ用配列
	moved_mino = [];
	moved_minoColor = [];
	switch (true) {
		case number < 5:
			moved_mino[0] = [0, 0, 0, 0];
			moved_minoColor[0] = [null, null, null, null];
			for (let y = 1; y < max_size; y++) {
				moved_mino[y] = [];
				moved_minoColor[y] = [];
				for (let x = 0; x < max_size - 1; x++) {
					moved_mino[y][x] = mino[max_size - 1 - x][y - 1];
					moved_minoColor[y][x] = KONAMImode === 8 ? nowmino_color[max_size - 1 - x][y - 1] : null;
				}
				moved_mino[y][3] = 0;
				moved_minoColor[y][3] = null;
			}
			break;

		case number >= 5:
			for (let y = 0; y < max_size; y++) {
				moved_mino[y] = [];
				moved_minoColor[y] = [];
				for (let x = 0; x < max_size; x++) {
					moved_mino[y][x] = mino[max_size - 1 - x][y];
					moved_minoColor[y][x] = KONAMImode === 8 ? nowmino_color[max_size - 1 - x][y] : null;
				}
			}
			break;
	}
	moved_mino[4] = mino[4];
	moved_direction = mino_direction + 1;
	if (moved_direction > 3) {
		moved_direction = 0;
	}
	return moved_mino;
};

// 左回転
const left_rotated = () => {
	moved_mino = [];
	moved_minoColor = [];
	switch (true) {
		case nowmino_number < 5:
			moved_mino[0] = [0, 0, 0, 0];
			moved_minoColor[0] = [null, null, null, null];
			for (let y = 1; y < max_size; y++) {
				moved_mino[y] = [];
				moved_minoColor[y] = [];
				for (let x = 0; x < max_size - 1; x++) {
					moved_mino[y][x] = nowmino[x + 1][max_size - 1 - y];
					moved_minoColor[y][x] = KONAMImode === 8 ? nowmino_color[x + 1][max_size - 1 - y] : null;
				}
				moved_mino[y][3] = 0;
				moved_minoColor[y][3] = null;
			}
			break;

		case nowmino_number >= 5:
			for (let y = 0; y < max_size; y++) {
				moved_mino[y] = [];
				moved_minoColor[y] = [];
				for (let x = 0; x < max_size; x++) {
					moved_mino[y][x] = nowmino[x][max_size - 1 - y];
					moved_minoColor[y][x] = KONAMImode === 8 ? nowmino_color[x][max_size - 1 - y] : null;
				}
			}
			break;
	}
	moved_mino[4] = nowmino[4];
	moved_direction = mino_direction - 1;
	if (moved_direction < 0) {
		moved_direction = 3;
	}
	return moved_mino;
};

// お邪魔上昇
function wall_upper(count) {
	for (let i = 0; i < count; i++) {
		for (let j = 1; j < playscreen_height; j++) {
			screen[j - 1] = [...screen[j]];
			block_color[j - 1] = [...block_color[j]];
		}

		for (let j = 0; j < justdropped.length; j++) {
			justdropped[j] = [justdropped[j][0], justdropped[j][1] - 1];
		}

		const hole = Math.floor(Math.random() * playscreen_width);
		for (let j = 0; j < playscreen_width; j++) {
			if (j == hole) {
				screen[playscreen_height - 1][j] = 0;
				block_color[playscreen_height - 1][j] = null;
			} else {
				screen[playscreen_height - 1][j] = 1;
				block_color[playscreen_height - 1][j] = 'lightgray';
			}
		}
	}
}

// 固定処理
const freeze_mino = () => {
	justdropped = [];
	for (let y = max_size - 1; y >= 0; y--) {
		for (let x = 0; x < max_size; x++) {
			if (nowmino[y][x] === 1) {
				if (KONAMImode !== 8) {
					screen[mino_distanceY + y][mino_distanceX + x] = 1;
					block_color[mino_distanceY + y][mino_distanceX + x] = nowmino[4];
					justdropped.push([mino_distanceX + x, mino_distanceY + y]);
				} else {
					dropping_block.push({ x: mino_distanceX + x, y: mino_distanceY + y, color: nowmino_color[y][x] });
				}
			}
		}
	}

	if (KONAMImode == 2) wall_upper(1);
};

const create_mino_position = () => {
	mino_distanceX = playscreen_width / 2 - max_size / 2;
	mino_distanceY = -1;
};

function random_mino() {
	let result = [];
	for (let i = 0; i < max_size; i++) {
		result[i] = [];
		for (let j = 0; j < max_size; j++) {
			const data = Math.floor(Math.random() * 3);
			if (data < 2) {
				result[i][j] = 0;
			} else {
				result[i][j] = 1;
			}
		}
	}

	result[4] = random_color();

	return result;
}

function random_color() {
	const red = Math.floor(Math.random() * 256);
	const green = Math.floor(Math.random() * 256);
	const blue = Math.floor(Math.random() * 256);

	return `rgb(${red}, ${green}, ${blue})`;
}

// 次のミノを生成
const repop = () => {
	holdOK = true;

	// 袋から番号をランダムに取得し、順にnextsに入れる
	while (nexts.length < 7) {
		// ミノ袋をリセット
		if (bag.length === 0) {
			bag = [...default_bag];
		}

		let random_inbag = Math.floor(Math.random() * bag.length);
		mino_number = bag.splice(random_inbag, 1)[0];
		nexts.push(KONAMImode !== 5 ? minos[mino_number] : random_mino());

		if (KONAMImode === 8) {
			let mino_color = [];
			for (let y = 0; y < max_size; y++) {
				mino_color[y] = [];
				for (let x = 0; x < max_size; x++) {
					if (minos[mino_number][y][x] === 1) {
						const color_pick = Math.floor(Math.random() * puyopuyoColors.length);
						mino_color[y][x] = puyopuyoColors[color_pick];
					} else {
						mino_color[y][x] = null;
					}
				}
			}
			nextsColors.push(mino_color);
		}
	}
	// ミノを取得
	nowmino = nexts.splice(0, 1)[0];
	nowmino_number = KONAMImode !== 5 ? minos.findIndex((item) => item === nowmino) : 9;
	nowmino_color = nextsColors.splice(0, 1)[0];
	mino_direction = 0;

	create_mino_position();
};

// 音ゲー
function humen_master(humen) {
	measure = 0;
	BPM = humen.BPM;

	const audio = document.getElementById('BGM');
	audio.src = `./scores/${humen.wave}`;

	scrolling = setInterval(drop_mino, (15 / BPM) * 1000);

	if (humen.offset > 0) {
		audio.play();
		setTimeout(() => run_score(humen, measure), (humen.offset - 270 / BPM) * 1000);
	} else {
		run_score(humen, measure);
		setTimeout(() => audio.play(), (humen.offset + 270 / BPM) * 1000);
	}
}

function run_score(humen, measure) {
	console.log(measure);
	console.log(dropping_block);
	let time = 0;
	const nowmeasure = humen.scores[measure];
	const commands = Object.keys(nowmeasure);
	if (commands.length > 1) {
		if (commands.includes('BPMchange')) {
			BPM = measure.BPMchange;
		}
	}
	const interval = (60 / BPM) * 1000;
	generate_notes(nowmeasure, time, (interval * 4) / nowmeasure.score.length);
	measure++;
	if (measure < humen.scores.length) {
		setTimeout(() => run_score(humen, measure), interval * 4);
	} else {
		setTimeout(() => clearTimeout(scrolling), interval * 12);
	}
}

function generate_notes(measure, time, interval) {
	console.log(time);
	const column = measure.score[time];
	column.forEach((value, index) => {
		if (value === 1) {
			dropping_block.push({ x: index, y: -1, color: 'lightskyblue' });
		}
	});
	time++;
	if (time < measure.score.length) {
		setTimeout(() => generate_notes(measure, time, interval), interval);
	}
}

// srsチェック
const SRScheck = (SRS_list) => {
	for (let i = 0; i < SRS_list.length; i++) {
		let srs_position = SRS_list[i];
		if (can_move(srs_position[0], srs_position[1], moved_mino)) {
			nowmino = moved_mino;
			nowmino_color = moved_minoColor;
			mino_direction = moved_direction;
			mino_distanceX = mino_distanceX + srs_position[0];
			mino_distanceY = mino_distanceY + srs_position[1];
			if (nowmino_number === 4) {
				Tspin_chance = true;
			}
			break;
		}
	}
};

// 1: ミノ統一
// 2: せりあがる壁
// 3: 強制btob
// 4: ミノ透明化
// 5: ランダムミノ
// 6: 自動回転
// 7: ミノ変化
// 8: ぷよぷよ
// 9: 音ゲー(未完成)

// KONAMIモード移行
async function KONAMIchange() {
	score = 0;
	KONAMImode = Math.floor(Math.random() * 8) + 1;
	// 9は未完成

	switch (KONAMImode) {
		case 1:
			default_bag = [Math.floor(Math.random() * 7)];
			break;

		case 5:
			default_bag = [];
			break;

		case 8:
			dropping_block = [];
			puyogroups = [];
			justdroppuyo = [];
			break;

		case 9:
			// fetch APIを使ってJSONファイルを非同期で取得
			fetch('./scores/test.json') // JSONファイルのパス
				.then((response) => response.json()) // レスポンスをJSONとしてパース
				.then((humen) => {
					humen_master(humen);
				});
			break;
	}
	KONAMIcount = 4;
	clearInterval(loop);
	init();
}

function rotate_right() {
	moved_mino = right_rotated(nowmino);
	switch (true) {
		case moved_direction === 0:
			SRScheck(nowmino_number !== 5 ? from3to0 : I_from3to0);
			break;

		case moved_direction === 1:
			SRScheck(nowmino_number !== 5 ? to1 : I_from0to1);
			break;

		case moved_direction === 2:
			SRScheck(nowmino_number !== 5 ? from1to2 : I_from1to2);
			break;

		case moved_direction === 3:
			SRScheck(nowmino_number !== 5 ? to3 : I_from2to3);
			break;
	}

	if (!can_move(0, 2, nowmino) && cannotmove_counter < 20 && dropping_block.length === 0) {
		clearInterval(loop);
		loop = setInterval(drop_mino, dropping_speed);
		cannotmove_counter++;
	} else {
		cannotmove_counter = 0;
	}
}

function rotate_left() {
	moved_mino = left_rotated();
	switch (true) {
		case moved_direction === 0:
			SRScheck(nowmino_number !== 5 ? from1to0 : I_from1to0);
			break;

		case moved_direction === 1:
			SRScheck(nowmino_number !== 5 ? to1 : I_from2to1);
			break;

		case moved_direction === 2:
			SRScheck(nowmino_number !== 5 ? from3to2 : I_from3to2);
			break;

		case moved_direction === 3:
			SRScheck(nowmino_number !== 5 ? to3 : I_from0to3);
			break;
	}

	if (!can_move(0, 2, nowmino) && cannotmove_counter < 20 && dropping_block.length === 0) {
		clearInterval(loop);
		loop = setInterval(drop_mino, dropping_speed);
		cannotmove_counter++;
	} else {
		cannotmove_counter = 0;
	}
}

// 操作
document.onkeydown = (e) => {
	if (pause) {
		if (e.code === 'KeyC') {
			pause = false;
			loop = setInterval(drop_mino, dropping_speed);
		}
	} else {
		if (gameover && e.code === 'Enter') {
			gameover = false;
			KONAMImode = false;
			init();
		} else {
			if (!gameover) {
				switch (e.code) {
					case 'KeyC':
						clearInterval(loop);
						pause = true;
						break;

					case 'ArrowLeft':
						moved_direction = null;
						if (can_move(-1, 0, nowmino)) {
							mino_distanceX--;
							Tspin_chance = false;
						}

						if (!can_move(0, 1, nowmino) && cannotmove_counter < 20 && dropping_block.length === 0) {
							clearInterval(loop);
							loop = setInterval(drop_mino, dropping_speed);
							cannotmove_counter++;
						} else {
							cannotmove_counter = 0;
						}
						break;

					case 'ArrowRight':
						moved_direction = null;
						if (can_move(1, 0, nowmino)) {
							mino_distanceX++;
							Tspin_chance = false;
						}

						if (!can_move(0, 1, nowmino) && cannotmove_counter < 20 && dropping_block.length === 0) {
							clearInterval(loop);
							loop = setInterval(drop_mino, dropping_speed);
							cannotmove_counter++;
						} else {
							cannotmove_counter = 0;
						}
						break;

					case 'ArrowDown':
						if (can_move(0, 1, nowmino)) {
							mino_distanceY++;
							score = score + 3;

							if (!can_move(0, 2, nowmino) && cannotmove_counter < 20 && dropping_block.length === 0) {
								clearInterval(loop);
								loop = setInterval(drop_mino, dropping_speed);
								cannotmove_counter++;
							} else {
								cannotmove_counter = 0;
							}
						}
						break;

					case 'ArrowUp':
						rotate_right();
						break;

					case 'KeyZ':
						rotate_left();
						break;

					case 'Space':
						if (dropping_block.length !== 0) break;
						while (can_move(0, 1, nowmino)) {
							mino_distanceY++;
							score = score + 8;
						}
						drop_mino();
						clearInterval(loop);
						loop = setInterval(drop_mino, dropping_speed);
						break;

					case 'KeyX':
						if (holdOK && KONAMImode !== 8) {
							if (!holdmino) {
								holdmino = KONAMImode !== 5 ? minos[nowmino_number] : nowmino;
								repop();
							} else {
								[nowmino, holdmino] = [holdmino, nowmino];
								holdmino = KONAMImode !== 5 ? minos[nowmino_number] : holdmino;
								create_mino_position();
							}

							holdOK = false;
							nowmino_number = KONAMImode !== 5 ? minos.findIndex((item) => item === nowmino) : 9;

							if (!can_move(0, 2, nowmino) && cannotmove_counter < 20) {
								clearInterval(loop);
								loop = setInterval(drop_mino, dropping_speed);
								cannotmove_counter++;
							} else {
								cannotmove_counter = 0;
							}
						}
						break;
				}

				if (inputs.length < 10 && !KONAMImode) {
					inputs.push(e.code);
				}

				if (JSON.stringify(inputs) == KONAMIcommand) {
					KONAMIchange();
				}

				draw_playscreen(true);
			}
		}
	}
};

// パフェ処理
const func_perfect = (screen) => {
	for (let y = 0; y < playscreen_height; y++) {
		for (let x = 0; x < playscreen_width; x++) {
			if (screen[y][x] !== 0) {
				return false;
			}
		}
	}
	return true;
};

// ライン消去
const clear_line_check = () => {
	let clear_line_count = 0;
	let filled_line = [];

	let checkedline = [];
	// そろっているかどうかチェック
	for (let i = 0; i < justdropped.length; i++) {
		const y = justdropped[i][1];
		if (!checkedline.includes(y) && y >= 0) {
			checkedline.push(y);
			// 抜けがあるかチェック
			if (screen[y].some((element) => element == 0)) {
				filled_line[y] = false;
			} else {
				filled_line[y] = true;
				clear_line_count++;
			}
		}
	}

	if (clear_line_count === 4) {
		TETRIS = 3;
	}

	if (clear_line_count > 0) {
		if (clear_line_count === 4 || (Tspin && clear_line_count > 0)) {
			if (BtoBchance) {
				BtoB = true;
			} else {
				BtoBchance = true;
			}
		} else {
			BtoBchance = false;
			BtoB = false;
		}
	}

	if (clear_line_count > 0) {
		ren++;

		// スコア加算
		if (Tspin) {
			score = score + Tspin_scores[clear_line_count - 1];
			Tspin_count = clear_line_count;
		}

		if (BtoB) {
			score = score + 200;
		}

		score = score + Math.floor(scores[clear_line_count - 1] * 1 + ren / 10);
		clearedline = clearedline + clear_line_count;
		dropping_speed = Math.max(100, 500 - clearedline * 10);
		clearInterval(loop);
		loop = setInterval(drop_mino, dropping_speed);

		if (perfect) {
			score = score + 3000;
		}
	} else {
		ren = 0;
	}

	for (let y = 0; y < playscreen_height; y++) {
		if ((KONAMImode !== 3 && filled_line[y]) || (KONAMImode === 3 && filled_line[y] && (Tspin || TETRIS > 0))) {
			// 消去処理
			// そろった行から上へ順に処理
			for (let newY = y; newY > 0; newY--) {
				screen[newY] = [...screen[newY - 1]];
				block_color[newY] = [...block_color[newY - 1]];
			}
			screen[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			block_color[0] = [null, null, null, null, null, null, null, null, null, null];
			perfect = func_perfect(screen);

			for (let i = 0; i < justdropped.length; i++) {
				if (justdropped[i][1] !== y) {
					justdropped[i] = [justdropped[i][0], justdropped[i][1] + 1];
				} else {
					justdropped.splice(i);
				}
			}
		}
	}
};

// フィールドを中央に
const $container = document.getElementById('container');
$container.style.width = canvas_width + 'px';

function repopping() {
	if (KONAMImode === 9) return;
	repop();

	// 次のミノを出せなくなったらゲームオーバー
	if (!can_move(0, 0, nowmino)) {
		gameover = true;
		clearInterval(loop);
		if (highscore < score && !KONAMImode) {
			localStorage.setItem('highscore', parseInt(score));
			highscore = score;
		}
	}
}

function neighborcheck(x, y, color) {
	const setto = puyogroups.find((group) => {
		return group.pos.some((value) => value.x === x && value.y === y) && group.color === color;
	});
	return setto;
}

function make_puyogroups() {
	puyogroups = [];
	for (let puyoy = 0; puyoy < playscreen_height; puyoy++) {
		for (let puyox = 0; puyox < playscreen_width; puyox++) {
			if (screen[puyoy][puyox]) {
				const color = block_color[puyoy][puyox];

				const neighbor = [
					neighborcheck(puyox + 1, puyoy, color),
					neighborcheck(puyox - 1, puyoy, color),
					neighborcheck(puyox, puyoy + 1, color),
					neighborcheck(puyox, puyoy - 1, color),
				];

				const connect = neighbor.filter((value) => value);

				while (connect.length > 1 && neighborcheck(puyox, puyoy, color) == undefined) {
					const mixed = connect.splice(-1, 1)[0];
					connect[0].pos.push(...mixed.pos);
				}

				if (neighborcheck(puyox, puyoy, color) == undefined) {
					if (connect.length === 1) {
						connect[0].pos.push({ x: puyox, y: puyoy });
					} else {
						puyogroups.push({ color: color, pos: [{ x: puyox, y: puyoy }] });
					}
				}
			}
		}
	}
}

// 落下処理
const drop_mino = () => {
	if (dropping_block.length === 0 && KONAMImode !== 9) {
		if (can_move(0, 1, nowmino)) {
			mino_distanceY++;
			justdropped = [];
			Tspin_chance = false;
			switch (KONAMImode) {
				case 6:
					const move = Math.floor(Math.random() * 2);

					switch (move) {
						case 0:
							rotate_right();
							break;
						case 1:
							rotate_left();
							break;
					}
					break;
				case 7:
					const magic_number = Math.floor(Math.random() * 6) + 1;
					const magiced_number = (nowmino_number + magic_number) % 7;
					moved_mino = minos[magiced_number];
					for (let i = 0; i < mino_direction; i++) {
						moved_mino = right_rotated(moved_mino, magiced_number);
					}

					for (let i = 0; i < magic_mino.length; i++) {
						const after_pos = magic_mino[i];
						if (can_move(after_pos[0], after_pos[1], moved_mino)) {
							nowmino = moved_mino;
							nowmino_number = magiced_number;
							mino_distanceX += after_pos[0];

							Tspin_chance = false;
							break;
						}
					}
					break;
			}
		} else {
			if (Tspin_chance) {
				let Tspin_checker = 0;
				if (mino_distanceY + 1 < playscreen_height) {
					Tspin_checker = Tspin_checker + screen[mino_distanceY + 1][mino_distanceX + 0];
					Tspin_checker = Tspin_checker + screen[mino_distanceY + 1][mino_distanceX + 2];
				} else {
					Tspin_checker = Tspin_checker + 2;
				}
				if (mino_distanceY + 3 < playscreen_height) {
					Tspin_checker = Tspin_checker + screen[mino_distanceY + 3][mino_distanceX + 0];
					Tspin_checker = Tspin_checker + screen[mino_distanceY + 3][mino_distanceX + 2];
				} else {
					Tspin_checker = Tspin_checker + 2;
				}
				if (Tspin_checker > 2) {
					Tspin = true;
					Tspin_timer = 3;
				} else {
					Tspin = false;
				}
			} else {
				Tspin = false;
			}
			Tspin_chance = false;

			freeze_mino();
			clear_line_check();

			if (KONAMImode !== 8) {
				repopping();
			}
		}
	} else {
		const dealing_puyos = dropping_block.splice(0);
		const numofdrops = dealing_puyos.length;
		let cleared = false;
		for (let i = 0; i < numofdrops; i++) {
			const dealing = dealing_puyos[i];
			const X = dealing.x;
			const Y = dealing.y;
			const color = dealing.color;
			if (Y + 1 < playscreen_height && screen[Y + 1][X] === 0) {
				dropping_block.push({ x: X, y: Y + 1, color });
			} else {
				if (KONAMImode !== 9) {
					screen[Y][X] = 1;
					block_color[Y][X] = color;
				}
			}
		}

		if (dropping_block.length === 0 || KONAMImode !== 9) {
			make_puyogroups();

			justdroppuyo.splice(0);

			puyogroups.forEach((group, index) => {
				if (group.pos.length >= 4) {
					group.pos.forEach((element) => {
						screen[element.y][element.x] = 0;
						block_color[element.y][element.x] = null;
					});
					puyogroups.splice(index, 1);
					clearedline++;
					cleared = true;
				}
			});

			for (let y = playscreen_height - 2; y >= 0; y--) {
				for (let x = 0; x < playscreen_width; x++) {
					if (screen[y][x] && !screen[y + 1][x]) {
						dropping_block.push({ x, y: y + 1, color: block_color[y][x] });

						screen[y][x] = 0;
						block_color[y][x] = null;

						make_puyogroups();
					}
				}
			}

			if (cleared) ren++;

			if (dropping_block.length === 0) {
				repopping();
				ren = 0;
			}
		}
	}

	if (dropping_block.length === 0) {
		draw_playscreen(true);
	} else {
		draw_playscreen(false);
	}
};

// 初期化
const init = () => {
	// 画面本体用配列の作成
	for (let y = -2; y < playscreen_height; y++) {
		screen[y] = [];
		block_color[y] = [];
		for (let x = 0; x < playscreen_width; x++) {
			if (KONAMImode !== 9 || y !== 18) {
				screen[y][x] = 0;
				block_color[y][x] = null;
			} else {
				screen[y][x] = 0;
				block_color[y][x] = 'white';
			}
		}
	}

	// 落下速度
	dropping_speed = 500;

	if (!KONAMImode) {
		default_bag = [0, 1, 2, 3, 4, 5, 6];
	}

	score = 0;
	clearedline = 0;
	bag = default_bag.slice();
	nexts = [];
	holdmino = null;
	nowmino_color = null;
	nowmino_number = null;
	perfect = false;
	Tspin = false;
	BtoB = false;
	BtoBchance = false;
	ren = 0;
	pause = false;
	cannotmove_counter = 0;
	justdropped = [];
	inputs = [];
	dropping_block = [];

	if (KONAMImode !== 9) {
		repop();
		loop = setInterval(drop_mino, dropping_speed);
		create_mino_position();
		draw_playscreen(dropping_block.length !== 0);
	}
};

init();
