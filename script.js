const BASE_HP = 20;

const weaponMods = {
    melee: { light: 4, medium: 6, heavy: 8 },
    ranged: { light: 3, medium: 5, heavy: 0 },
    magic: { light: 3, medium: 5, heavy: 7 }
};
const fixedRangedDamage = { light: 8, medium: 12, heavy: 28 };

const armorData = {
    none:   { phys: 0, defPenalty: 0, dodgePenalty: 0, dodgePossible: true },
    light:  { phys: 2, defPenalty: 0, dodgePenalty: -1, dodgePossible: true },
    medium: { phys: 3, defPenalty: -2, dodgePenalty: 0, dodgePossible: true },
    heavy:  { phys: 5, defPenalty: -3, dodgePenalty: -999, dodgePossible: false }
};

const shieldData = {
    none:   { parry: 0, block: 0, blockRanged: false, dodgePossible: true },
    small:  { parry: 1, block: 0, blockRanged: false, dodgePossible: true },
    medium: { parry: 2, block: 2, blockRanged: true, dodgePossible: true },
    large:  { parry: 3, block: 3, blockRanged: true, dodgePossible: false }
};

const amuletData = {
    none:    { mag: 0, blockPenalty: 0, blockPossible: true },
    amulet:  { mag: 2, blockPenalty: -1, blockPossible: true },
    talisman:{ mag: 3, blockPenalty: -2, blockPossible: true },
    apotrop: { mag: 5, blockPenalty: -3, blockPossible: false }
};

let characters = [];

function initExamples() {
    characters = [
        { name: 'Фехтовальщица', side: 1, str:10, end:10, per:5, ref:10, mag:7, wil:5,
            weaponType: 'melee', weaponSize: 'light', fencing: false, dual: false, mechanical: false, dualSkill: false,
            attackType: 'normal', armor: 'none', shield: 'none', amulet: 'none', dmgBonus:0, accBonus:0, customPhys: '', customMag: '' },
        { name: 'Стрелок', side: 1, str:7, end:8, per:10, ref:10, mag:4, wil:7,
            weaponType: 'ranged', weaponSize: 'light', fencing: false, dual: false, mechanical: true, dualSkill: false,
            attackType: 'normal', armor: 'light', shield: 'none', amulet: 'none', dmgBonus:0, accBonus:0, customPhys: '', customMag: '' },
        { name: 'Маг', side: 1, str:5, end:6, per:4, ref:10, mag:10, wil:9,
            weaponType: 'magic', weaponSize: 'medium', fencing: false, dual: false, mechanical: false, dualSkill: false,
            attackType: 'normal', armor: 'light', shield: 'none', amulet: 'none', dmgBonus:0, accBonus:0, customPhys: '', customMag: '' },
        { name: 'Паладин', side: 1, str:9, end:9, per:6, ref:6, mag:8, wil:7,
            weaponType: 'melee', weaponSize: 'heavy', fencing: false, dual: false, mechanical: false, dualSkill: false,
            attackType: 'normal', armor: 'heavy', shield: 'none', amulet: 'none', dmgBonus:0, accBonus:0, customPhys: '', customMag: '' },
        { name: 'Дингус', side: 2, str:13, end:10, per:5, ref:5, mag:5, wil:5,
            weaponType: 'melee', weaponSize: 'heavy', fencing: false, dual: false, mechanical: false, dualSkill: false,
            attackType: 'normal', armor: 'light', shield: 'none', amulet: 'none', dmgBonus:0, accBonus:0, customPhys: '', customMag: '', hpBonus:8 },
        { name: 'Грумпи', side: 2, str:10, end:10, per:5, ref:10, mag:5, wil:5,
            weaponType: 'melee', weaponSize: 'medium', fencing: false, dual: true, mechanical: false, dualSkill: true,
            attackType: 'normal', armor: 'none', shield: 'none', amulet: 'none', dmgBonus:0, accBonus:0, customPhys: '', customMag: '' },
        { name: 'Магси', side: 2, str:10, end:10, per:5, ref:5, mag:5, wil:8,
            weaponType: 'melee', weaponSize: 'medium', fencing: false, dual: true, mechanical: false, dualSkill: true,
            attackType: 'normal', armor: 'none', shield: 'none', amulet: 'none', dmgBonus:0, accBonus:0, customPhys: '', customMag: '' },
        { name: 'Градж', side: 2, str:5, end:6, per:12, ref:10, mag:5, wil:5,
            weaponType: 'ranged', weaponSize: 'light', fencing: false, dual: false, mechanical: true, dualSkill: false,
            attackType: 'normal', armor: 'light', shield: 'none', amulet: 'none', dmgBonus:0, accBonus:0, customPhys: '', customMag: '' }
    ];
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('char-tbody');
    tbody.innerHTML = '';
    characters.forEach((char, idx) => {
        let attackOptions; // убрана избыточная инициализация
        if (char.weaponType === 'melee') {
            attackOptions = `
        <option value="normal" ${char.attackType === 'normal' ? 'selected' : ''}>Обычный</option>
        <option value="accurate" ${char.attackType === 'accurate' ? 'selected' : ''}>Точный</option>
        <option value="powerful" ${char.attackType === 'powerful' ? 'selected' : ''}>Сильный</option>
        <option value="flurry" ${char.attackType === 'flurry' ? 'selected' : ''}>Шквал</option>
      `;
        } else if (char.weaponType === 'ranged') {
            if (char.mechanical) {
                attackOptions = `<option value="normal" selected>Обычный</option>`;
            } else {
                attackOptions = `
          <option value="normal" ${char.attackType === 'normal' ? 'selected' : ''}>Обычный</option>
          <option value="aimed" ${char.attackType === 'aimed' ? 'selected' : ''}>Прицельный</option>
          <option value="piercing" ${char.attackType === 'piercing' ? 'selected' : ''}>Пробивной</option>
        `;
            }
        } else {
            attackOptions = `<option value="normal" selected>Обычная</option>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td><input type="text" value="${char.name || ''}" onchange="updateChar(${idx}, 'name', this.value)" style="min-width:90px;"></td>
      <td><select onchange="updateChar(${idx}, 'side', +this.value)">
        <option value="1" ${char.side === 1 ? 'selected' : ''}>Игрок</option>
        <option value="2" ${char.side === 2 ? 'selected' : ''}>Враг</option>
      </select></td>
      <td><input type="number" value="${char.str !== undefined ? char.str : ''}" onchange="updateChar(${idx}, 'str', this.value)"></td>
      <td><input type="number" value="${char.end !== undefined ? char.end : ''}" onchange="updateChar(${idx}, 'end', this.value)"></td>
      <td><input type="number" value="${char.per !== undefined ? char.per : ''}" onchange="updateChar(${idx}, 'per', this.value)"></td>
      <td><input type="number" value="${char.ref !== undefined ? char.ref : ''}" onchange="updateChar(${idx}, 'ref', this.value)"></td>
      <td><input type="number" value="${char.mag !== undefined ? char.mag : ''}" onchange="updateChar(${idx}, 'mag', this.value)"></td>
      <td><input type="number" value="${char.wil !== undefined ? char.wil : ''}" onchange="updateChar(${idx}, 'wil', this.value)"></td>
      <td><select onchange="updateChar(${idx}, 'weaponType', this.value); renderTable();">
        <option value="melee" ${char.weaponType === 'melee' ? 'selected' : ''}>Ближнее</option>
        <option value="ranged" ${char.weaponType === 'ranged' ? 'selected' : ''}>Дальнее</option>
        <option value="magic" ${char.weaponType === 'magic' ? 'selected' : ''}>Магия</option>
      </select></td>
      <td><select onchange="updateChar(${idx}, 'weaponSize', this.value)">
        <option value="light" ${char.weaponSize === 'light' ? 'selected' : ''}>Лёгкое</option>
        <option value="medium" ${char.weaponSize === 'medium' ? 'selected' : ''}>Среднее</option>
        <option value="heavy" ${char.weaponSize === 'heavy' ? 'selected' : ''}>Тяжёлое</option>
      </select></td>
      <td><input type="checkbox" ${char.fencing ? 'checked' : ''} onchange="updateChar(${idx}, 'fencing', this.checked)"></td>
      <td><input type="checkbox" ${char.dual ? 'checked' : ''} onchange="updateChar(${idx}, 'dual', this.checked)"></td>
      <td><input type="checkbox" ${char.mechanical ? 'checked' : ''} onchange="updateChar(${idx}, 'mechanical', this.checked); renderTable();"></td>
      <td><input type="checkbox" ${char.dualSkill ? 'checked' : ''} onchange="updateChar(${idx}, 'dualSkill', this.checked)"></td>
      <td><select onchange="updateChar(${idx}, 'attackType', this.value)">
        ${attackOptions}
      </select></td>
      <td><select onchange="updateChar(${idx}, 'armor', this.value)">
        <option value="none" ${char.armor === 'none' ? 'selected' : ''}>Нет</option>
        <option value="light" ${char.armor === 'light' ? 'selected' : ''}>Лёгкая</option>
        <option value="medium" ${char.armor === 'medium' ? 'selected' : ''}>Средняя</option>
        <option value="heavy" ${char.armor === 'heavy' ? 'selected' : ''}>Тяжёлая</option>
      </select></td>
      <td><select onchange="updateChar(${idx}, 'shield', this.value)">
        <option value="none" ${char.shield === 'none' ? 'selected' : ''}>Нет</option>
        <option value="small" ${char.shield === 'small' ? 'selected' : ''}>Малый</option>
        <option value="medium" ${char.shield === 'medium' ? 'selected' : ''}>Средний</option>
        <option value="large" ${char.shield === 'large' ? 'selected' : ''}>Большой</option>
      </select></td>
      <td><select onchange="updateChar(${idx}, 'amulet', this.value)">
        <option value="none" ${char.amulet === 'none' ? 'selected' : ''}>Нет</option>
        <option value="amulet" ${char.amulet === 'amulet' ? 'selected' : ''}>Амулет</option>
        <option value="talisman" ${char.amulet === 'talisman' ? 'selected' : ''}>Талисман</option>
        <option value="apotrop" ${char.amulet === 'apotrop' ? 'selected' : ''}>Апотропей</option>
      </select></td>
      <td><input type="number" value="${char.dmgBonus !== undefined ? char.dmgBonus : ''}" onchange="updateChar(${idx}, 'dmgBonus', this.value)"></td>
      <td><input type="number" value="${char.accBonus !== undefined ? char.accBonus : ''}" onchange="updateChar(${idx}, 'accBonus', this.value)"></td>
      <td><input type="number" value="${char.customPhys !== undefined ? char.customPhys : ''}" placeholder="физ" onchange="updateChar(${idx}, 'customPhys', this.value)"></td>
      <td><input type="number" value="${char.customMag !== undefined ? char.customMag : ''}" placeholder="маг" onchange="updateChar(${idx}, 'customMag', this.value)"></td>
      <td><button class="btn-danger" onclick="removeCharacter(${idx})" style="padding:4px 8px;">✖</button></td>
    `;
        tbody.appendChild(tr);
    });
}

function updateChar(index, field, value) {
    characters[index][field] = value;
}

function removeCharacter(index) {
    characters.splice(index, 1);
    renderTable();
}

function addCharacter() {
    characters.push({
        name: '', side: 1, str: '', end: '', per: '', ref: '', mag: '', wil: '',
        weaponType: 'melee', weaponSize: 'light', fencing: false, dual: false, mechanical: false, dualSkill: false,
        attackType: 'normal', armor: 'none', shield: 'none', amulet: 'none', dmgBonus: '', accBonus: '', customPhys: '', customMag: ''
    });
    renderTable();
}

function computeStats(char) {
    const safe = (val) => { const n = Number(val); return isNaN(n) ? 0 : n; };
    const str = safe(char.str);
    const end = safe(char.end);
    const per = safe(char.per);
    const ref = safe(char.ref);
    const mag = safe(char.mag);
    const wil = safe(char.wil);
    const dmgBonus = safe(char.dmgBonus);
    const accBonus = safe(char.accBonus);
    const hpBonus = safe(char.hpBonus);

    const hp = BASE_HP + end + hpBonus;
    let baseAcc = 0;
    if (char.weaponType === 'melee') baseAcc = char.fencing ? per : str;
    else if (char.weaponType === 'ranged') baseAcc = per;
    else if (char.weaponType === 'magic') baseAcc = mag;

    let baseDmg = 0;
    if (char.weaponType === 'melee') baseDmg = Math.floor((str + end) / 4);
    else if (char.weaponType === 'ranged') baseDmg = Math.floor((per + ref) / 4);
    else if (char.weaponType === 'magic') baseDmg = Math.floor((mag + wil) / 4);

    let weaponMod = 0;
    if (!char.mechanical) {
        weaponMod = weaponMods[char.weaponType][char.weaponSize] || 0;
    }

    let attackDamageMod = 0, attackAccMod = 0, isFullAction = false;
    if (char.attackType !== 'normal') {
        if (char.weaponType === 'melee') {
            if (char.attackType === 'accurate') { attackDamageMod = -4; attackAccMod = +4; isFullAction = true; }
            else if (char.attackType === 'powerful') { attackDamageMod = +4; attackAccMod = -4; isFullAction = true; }
            else if (char.attackType === 'flurry') { attackDamageMod = +6; attackAccMod = -4; isFullAction = true; }
        } else if (char.weaponType === 'ranged' && !char.mechanical) {
            if (char.attackType === 'aimed') { attackDamageMod = 0; attackAccMod = +4; isFullAction = true; }
            else if (char.attackType === 'piercing') { attackDamageMod = +4; attackAccMod = 0; isFullAction = true; }
        }
    }

    let totalAcc = baseAcc + accBonus + attackAccMod;
    let mainDmg = baseDmg + weaponMod + dmgBonus + attackDamageMod;
    if (char.mechanical && char.weaponType === 'ranged') {
        mainDmg = (fixedRangedDamage[char.weaponSize] || 0) + dmgBonus + attackDamageMod;
    }

    let totalDmg = mainDmg;
    if (char.dual && !isFullAction && !char.mechanical && (char.weaponSize === 'light' || char.dualSkill)) {
        totalDmg += Math.floor(mainDmg / 2);
    }

    const armor = armorData[char.armor] || armorData.none;
    const shield = shieldData[char.shield] || shieldData.none;
    const amulet = amuletData[char.amulet] || amuletData.none;

    let parry = -999;
    if (char.weaponType === 'melee' || char.shield !== 'none') {
        parry = end + shield.parry + armor.defPenalty;
    }
    let dodge = -999;
    if (armor.dodgePossible && shield.dodgePossible) {
        dodge = ref + armor.dodgePenalty;
    }
    let block = -999;
    if (shield.blockRanged) {
        block = end + shield.block + armor.defPenalty;
    }

    let meleeDef;
    const parryAvail = parry > -999;
    const dodgeAvail = dodge > -999;
    if (parryAvail && dodgeAvail) meleeDef = Math.max(parry, dodge);
    else if (parryAvail) meleeDef = parry;
    else if (dodgeAvail) meleeDef = dodge;
    else meleeDef = -999;

    let rangedDef;
    if (shield.blockRanged) {
        rangedDef = dodgeAvail ? Math.max(dodge, block) : block;
    } else {
        rangedDef = dodgeAvail ? dodge : -999;
    }

    const magicDef = wil;
    let physArmor = armor.phys;
    if (char.customPhys !== undefined && char.customPhys !== '') physArmor = safe(char.customPhys);
    let magArmor = amulet.mag;
    if (char.customMag !== undefined && char.customMag !== '') magArmor = safe(char.customMag);

    let baseFormula; // убрана избыточная инициализация
    if (char.weaponType === 'melee') baseFormula = `(STR+END)/4 = ${baseDmg}`;
    else if (char.weaponType === 'ranged') baseFormula = `(PER+REF)/4 = ${baseDmg}`;
    else baseFormula = `(MAG+WIL)/4 = ${baseDmg}`;

    return { hp, totalAcc, baseFormula, totalDmg, meleeDef, rangedDef, magicDef, physArmor, magArmor, weaponType: char.weaponType };
}

function hitProbability(attMod, defMod) {
    let win = 0, lose = 0;
    for (let a = 1; a <= 20; a++) {
        for (let d = 1; d <= 20; d++) {
            if (a === 20 && d !== 20) { win++; continue; }
            if (a === 1 && d !== 1) { lose++; continue; }
            if (d === 20 && a !== 20) { lose++; continue; }
            if (d === 1 && a !== 1) { win++; continue; }
            const attTotal = a + attMod;
            const defTotal = d + defMod;
            if (attTotal > defTotal) win++;
            else if (attTotal < defTotal) lose++;
        }
    }
    return win / (win + lose);
}

function calculate() {
    const stats = characters.map(char => computeStats(char));
    const n = characters.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        const attacker = characters[i];
        const attStats = stats[i];
        for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const targetStats = stats[j];
            let def;
            if (attacker.weaponType === 'melee') def = targetStats.meleeDef;
            else if (attacker.weaponType === 'ranged') def = targetStats.rangedDef;
            else def = targetStats.magicDef;

            const prob = hitProbability(attStats.totalAcc, def);
            const rawDamage = attStats.totalDmg;
            const armor = (attacker.weaponType === 'magic') ? targetStats.magArmor : targetStats.physArmor;
            const effectiveDamage = Math.max(1, rawDamage - armor);
            matrix[i][j] = effectiveDamage * prob;
        }
    }

    const players = characters.map((c, idx) => ({ idx, side: c.side })).filter(p => p.side === 1);
    const enemies = characters.map((c, idx) => ({ idx, side: c.side })).filter(p => p.side === 2);

    const totalHpPlayers = players.reduce((sum, p) => sum + stats[p.idx].hp, 0);
    const totalHpEnemies = enemies.reduce((sum, e) => sum + stats[e.idx].hp, 0);

    let bestPlayerDmg = 0, worstPlayerDmg = 0;
    players.forEach(p => {
        const dmgToEnemies = enemies.map(e => matrix[p.idx][e.idx]);
        if (dmgToEnemies.length) {
            bestPlayerDmg += Math.max(...dmgToEnemies);
            worstPlayerDmg += Math.min(...dmgToEnemies);
        }
    });
    const avgPlayerDmg = (bestPlayerDmg + worstPlayerDmg) / 2;

    let bestEnemyDmg = 0, worstEnemyDmg = 0;
    enemies.forEach(e => {
        const dmgToPlayers = players.map(p => matrix[e.idx][p.idx]);
        if (dmgToPlayers.length) {
            bestEnemyDmg += Math.max(...dmgToPlayers);
            worstEnemyDmg += Math.min(...dmgToPlayers);
        }
    });
    const avgEnemyDmg = (bestEnemyDmg + worstEnemyDmg) / 2;

    const roundsPlayerAvg = avgPlayerDmg > 0 ? totalHpEnemies / avgPlayerDmg : Infinity;
    const roundsEnemyAvg = avgEnemyDmg > 0 ? totalHpPlayers / avgEnemyDmg : Infinity;
    const ratio = roundsPlayerAvg / roundsEnemyAvg;

    let category;
    let categoryClass;
    let desc;
    if (ratio < 0.67) {
        category = 'Лёгкий бой';
        categoryClass = 'category-easy';
        desc = 'Игроки побеждают как минимум в 1.5 раза быстрее врагов (средний сценарий).';
    } else if (ratio < 1.5) {
        category = 'Равный бой';
        categoryClass = 'category-balanced';
        desc = 'Шансы примерно равны (средний сценарий).';
    } else if (ratio < 2.0) {
        category = 'Трудный бой';
        categoryClass = 'category-hard';
        desc = 'Враги побеждают в 1.5–2 раза быстрее игроков, высок риск поражения (средний сценарий).';
    } else {
        category = 'Смертельный бой';
        categoryClass = 'category-deadly';
        desc = 'Враги побеждают более чем вдвое быстрее, победа игроков маловероятна (средний сценарий).';
    }

    let mostVulnerable = { name: '', ratio: Infinity };
    players.forEach(p => {
        const totalDmgToPlayer = enemies.reduce((sum, e) => sum + matrix[e.idx][p.idx], 0);
        const r = totalDmgToPlayer > 0 ? stats[p.idx].hp / totalDmgToPlayer : Infinity;
        if (r < mostVulnerable.ratio) mostVulnerable = { name: characters[p.idx].name, ratio: r };
    });

    let mostDangerous = { name: '', total: -Infinity };
    enemies.forEach(e => {
        const totalDmgToPlayers = players.reduce((sum, p) => sum + matrix[e.idx][p.idx], 0);
        if (totalDmgToPlayers > mostDangerous.total) mostDangerous = { name: characters[e.idx].name, total: totalDmgToPlayers };
    });

    let statsHtml = '<h3>Характеристики персонажей</h3><table><tr><th>Имя</th><th>Стор.</th><th>ОЗ</th><th>Точн.</th><th>База урона</th><th>Урон/ход</th><th>Защ(ближ)</th><th>Защ(даль)</th><th>Защ(маг)</th><th>Физ.бр</th><th>Маг.бр</th></tr>';
    characters.forEach((c, idx) => {
        const s = stats[idx];
        statsHtml += `<tr><td>${c.name}</td><td>${c.side === 1 ? 'Игрок' : 'Враг'}</td><td>${s.hp}</td><td>${s.totalAcc}</td><td>${s.baseFormula}</td><td>${s.totalDmg.toFixed(2)}</td><td>${s.meleeDef > -999 ? s.meleeDef : 'нет'}</td><td>${s.rangedDef > -999 ? s.rangedDef : 'нет'}</td><td>${s.magicDef}</td><td>${s.physArmor}</td><td>${s.magArmor}</td></tr>`;
    });
    statsHtml += '</table>';

    let matrixHtml = '<h3>Матрица ожидаемого урона за ход</h3><table><tr><th>Атакующий \\ Цель</th>';
    characters.forEach(c => matrixHtml += `<th>${c.name}</th>`);
    matrixHtml += '</tr>';
    for (let i = 0; i < n; i++) {
        matrixHtml += `<tr><td>${characters[i].name}</td>`;
        for (let j = 0; j < n; j++) {
            matrixHtml += `<td>${matrix[i][j].toFixed(2)}</td>`;
        }
        matrixHtml += '</tr>';
    }
    matrixHtml += '</table>';

    const metricsHtml = `
    <h3>Анализ боя (средний сценарий)</h3>
    <p>Суммарное ОЗ игроков: <strong>${totalHpPlayers}</strong></p>
    <p>Суммарное ОЗ врагов: <strong>${totalHpEnemies}</strong></p>
    <p>Средний суммарный урон игроков/ход: <strong>${avgPlayerDmg.toFixed(2)}</strong></p>
    <p>Средний суммарный урон врагов/ход: <strong>${avgEnemyDmg.toFixed(2)}</strong></p>
    <p>Время победы игроков: <strong>${roundsPlayerAvg === Infinity ? '∞' : roundsPlayerAvg.toFixed(2)}</strong> раундов</p>
    <p>Время победы врагов: <strong>${roundsEnemyAvg === Infinity ? '∞' : roundsEnemyAvg.toFixed(2)}</strong> раундов</p>
    <div class="category ${categoryClass}">Категория: ${category}</div>
    <p>${desc}</p>
    <p>Самый уязвимый игрок: <strong>${mostVulnerable.name}</strong> (ОЗ / ожидаемый урон по нему = ${mostVulnerable.ratio.toFixed(2)})</p>
    <p>Самый опасный враг: <strong>${mostDangerous.name}</strong> (суммарный урон по игрокам за ход = ${mostDangerous.total.toFixed(2)})</p>
  `;

    document.getElementById('stats-display').innerHTML = statsHtml;
    document.getElementById('matrix-display').innerHTML = matrixHtml;
    document.getElementById('metrics-display').innerHTML = metricsHtml;
    document.getElementById('results').style.display = 'block';
}

window.onload = initExamples;