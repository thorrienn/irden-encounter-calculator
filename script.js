const safe = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
};

const BASE_HP = 20;
const weaponMods = {
    melee: {
        light: 4,
        medium: 6,
        heavy: 8
    },
    ranged: {
        light: 3,
        medium: 5,
        heavy: 0
    },
    magic: {
        light: 3,
        medium: 5,
        heavy: 7
    }
};
const fixedRangedDamage = {
    light: 8,
    medium: 12,
    heavy: 28
};
const armorData = {
    none: {
        phys: 0,
        defPenalty: 0,
        dodgePenalty: 0,
        dodgePossible: true
    },
    light: {
        phys: 2,
        defPenalty: 0,
        dodgePenalty: -1,
        dodgePossible: true
    },
    medium: {
        phys: 3,
        defPenalty: -2,
        dodgePenalty: 0,
        dodgePossible: true
    },
    heavy: {
        phys: 5,
        defPenalty: -3,
        dodgePenalty: -999,
        dodgePossible: false
    }
};
const shieldData = {
    none: {
        parry: 0,
        block: 0,
        blockRanged: false,
        dodgePossible: true
    },
    small: {
        parry: 1,
        block: 0,
        blockRanged: false,
        dodgePossible: true
    },
    medium: {
        parry: 2,
        block: 2,
        blockRanged: true,
        dodgePossible: true
    },
    large: {
        parry: 3,
        block: 3,
        blockRanged: true,
        dodgePossible: false
    }
};
const amuletData = {
    none: {
        mag: 0,
        blockPenalty: 0,
        blockPossible: true
    },
    amulet: {
        mag: 2,
        blockPenalty: -1,
        blockPossible: true
    },
    talisman: {
        mag: 3,
        blockPenalty: -2,
        blockPossible: true
    },
    apotrop: {
        mag: 5,
        blockPenalty: -3,
        blockPossible: false
    }
};

let characters = [];

let battleLogsHistory = [];
let currentLogIndex = -1;
const MAX_HISTORY = 10;

function escapeHtml(unsafe) {
    if (unsafe === undefined || unsafe === null) return '';
    return String(unsafe).replace(/[&<>"]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        return m;
    });
}

function initExamples() {
    characters = [{
        name: 'Фехтовальщица',
        side: 1,
        str: 10,
        end: 10,
        per: 5,
        ref: 10,
        mag: 7,
        wil: 5,
        det: 5,
        weaponType: 'melee',
        weaponSize: 'medium',
        fencing: false,
        dual: false,
        mechanical: false,
        dualSkill: false,
        ignorePenalty: false,
        armor: 'none',
        shield: 'none',
        amulet: 'none',
        dmgBonus: 0,
        accBonus: 0,
        customPhys: '',
        customMag: '',
        hpOverride: '',
        hpBonus: 0,
        endBonus: 0,
        refBonus: 0,
        wilBonus: 0,
        detBonus: 0
    },
        {
            name: 'Стрелок',
            side: 1,
            str: 7,
            end: 8,
            per: 10,
            ref: 10,
            mag: 4,
            wil: 7,
            det: 6,
            weaponType: 'ranged',
            weaponSize: 'medium',
            fencing: false,
            dual: false,
            mechanical: true,
            dualSkill: false,
            ignorePenalty: false,
            armor: 'light',
            shield: 'none',
            amulet: 'none',
            dmgBonus: 0,
            accBonus: 0,
            customPhys: '',
            customMag: '',
            hpOverride: '',
            hpBonus: 0,
            endBonus: 0,
            refBonus: 0,
            wilBonus: 0,
            detBonus: 0
        },
        {
            name: 'Маг',
            side: 1,
            str: 5,
            end: 6,
            per: 4,
            ref: 10,
            mag: 10,
            wil: 9,
            det: 8,
            weaponType: 'magic',
            weaponSize: 'medium',
            fencing: false,
            dual: false,
            mechanical: false,
            dualSkill: false,
            ignorePenalty: false,
            armor: 'light',
            shield: 'none',
            amulet: 'none',
            dmgBonus: 0,
            accBonus: 0,
            customPhys: '',
            customMag: '',
            hpOverride: '',
            hpBonus: 0,
            endBonus: 0,
            refBonus: 0,
            wilBonus: 0,
            detBonus: 0
        },
        {
            name: 'Паладин',
            side: 1,
            str: 9,
            end: 9,
            per: 6,
            ref: 6,
            mag: 8,
            wil: 7,
            det: 7,
            weaponType: 'melee',
            weaponSize: 'heavy',
            fencing: false,
            dual: false,
            mechanical: false,
            dualSkill: false,
            ignorePenalty: false,
            armor: 'heavy',
            shield: 'none',
            amulet: 'none',
            dmgBonus: 0,
            accBonus: 0,
            customPhys: '',
            customMag: '',
            hpOverride: '',
            hpBonus: 0,
            endBonus: 0,
            refBonus: 0,
            wilBonus: 0,
            detBonus: 0
        },
        {
            name: 'Дингус',
            side: 2,
            str: 13,
            end: 10,
            per: 5,
            ref: 5,
            mag: 5,
            wil: 5,
            det: 8,
            weaponType: 'melee',
            weaponSize: 'heavy',
            fencing: false,
            dual: false,
            mechanical: false,
            dualSkill: false,
            ignorePenalty: false,
            armor: 'light',
            shield: 'none',
            amulet: 'none',
            dmgBonus: 0,
            accBonus: 0,
            customPhys: '',
            customMag: '',
            hpOverride: '',
            hpBonus: 8,
            endBonus: 0,
            refBonus: 0,
            wilBonus: 0,
            detBonus: 0
        },
        {
            name: 'Грумпи',
            side: 2,
            str: 10,
            end: 10,
            per: 5,
            ref: 10,
            mag: 5,
            wil: 5,
            det: 10,
            weaponType: 'melee',
            weaponSize: 'medium',
            fencing: false,
            dual: true,
            mechanical: false,
            dualSkill: true,
            ignorePenalty: false,
            armor: 'none',
            shield: 'none',
            amulet: 'none',
            dmgBonus: 0,
            accBonus: 0,
            customPhys: '',
            customMag: '',
            hpOverride: '',
            hpBonus: 0,
            endBonus: 0,
            refBonus: 0,
            wilBonus: 0,
            detBonus: 0
        },
        {
            name: 'Магси',
            side: 2,
            str: 10,
            end: 10,
            per: 5,
            ref: 5,
            mag: 5,
            wil: 8,
            det: 10,
            weaponType: 'melee',
            weaponSize: 'medium',
            fencing: false,
            dual: true,
            mechanical: false,
            dualSkill: true,
            ignorePenalty: false,
            armor: 'none',
            shield: 'none',
            amulet: 'none',
            dmgBonus: 0,
            accBonus: 0,
            customPhys: '',
            customMag: '',
            hpOverride: '',
            hpBonus: 0,
            endBonus: 0,
            refBonus: 0,
            wilBonus: 0,
            detBonus: 0
        },
        {
            name: 'Градж',
            side: 2,
            str: 5,
            end: 6,
            per: 12,
            ref: 10,
            mag: 5,
            wil: 5,
            det: 8,
            weaponType: 'ranged',
            weaponSize: 'medium',
            fencing: false,
            dual: false,
            mechanical: true,
            dualSkill: false,
            ignorePenalty: false,
            armor: 'light',
            shield: 'none',
            amulet: 'none',
            dmgBonus: 0,
            accBonus: 0,
            customPhys: '',
            customMag: '',
            hpOverride: '',
            hpBonus: 0,
            endBonus: 0,
            refBonus: 0,
            wilBonus: 0,
            detBonus: 0
        }
    ];
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('char-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    characters.forEach((char, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td><input type="text" value="${escapeHtml(char.name)}" onchange="updateChar(${idx}, 'name', this.value)" style="min-width:80px;"></td>
      <td><select onchange="updateChar(${idx}, 'side', +this.value)">
        <option value="1" ${char.side === 1 ? 'selected' : ''}>Игрок</option>
        <option value="2" ${char.side === 2 ? 'selected' : ''}>Враг</option>
      </select></td>
      <td><input type="number" value="${char.str ?? ''}" onchange="updateChar(${idx}, 'str', this.value)"></td>
      <td><input type="number" value="${char.end ?? ''}" onchange="updateChar(${idx}, 'end', this.value)"></td>
      <td><input type="number" value="${char.per ?? ''}" onchange="updateChar(${idx}, 'per', this.value)"></td>
      <td><input type="number" value="${char.ref ?? ''}" onchange="updateChar(${idx}, 'ref', this.value)"></td>
      <td><input type="number" value="${char.mag ?? ''}" onchange="updateChar(${idx}, 'mag', this.value)"></td>
      <td><input type="number" value="${char.wil ?? ''}" onchange="updateChar(${idx}, 'wil', this.value)"></td>
      <td><input type="number" value="${char.det ?? ''}" onchange="updateChar(${idx}, 'det', this.value)"></td>
      <td><input type="number" value="${char.endBonus ?? 0}" onchange="updateChar(${idx}, 'endBonus', this.value)" title="Бонус к END"></td>
<td><input type="number" value="${char.refBonus ?? 0}" onchange="updateChar(${idx}, 'refBonus', this.value)" title="Бонус к REF"></td>
<td><input type="number" value="${char.wilBonus ?? 0}" onchange="updateChar(${idx}, 'wilBonus', this.value)" title="Бонус к WIL"></td>
<td><input type="number" value="${char.detBonus ?? 0}" onchange="updateChar(${idx}, 'detBonus', this.value)" title="Бонус к DET"></td>
      <td><input type="number" value="${char.hpOverride ?? ''}" placeholder="Авто" onchange="updateChar(${idx}, 'hpOverride', this.value)"></td>
      <td><select onchange="updateChar(${idx}, 'weaponType', this.value); renderTable();">
        <option value="melee" ${char.weaponType === 'melee' ? 'selected' : ''}>Ближ</option>
        <option value="ranged" ${char.weaponType === 'ranged' ? 'selected' : ''}>Дальн</option>
        <option value="magic" ${char.weaponType === 'magic' ? 'selected' : ''}>Маг</option>
      </select></td>
      <td><select onchange="updateChar(${idx}, 'weaponSize', this.value)">
        <option value="light" ${char.weaponSize === 'light' ? 'selected' : ''}>Лёгк</option>
        <option value="medium" ${char.weaponSize === 'medium' ? 'selected' : ''}>Сред</option>
        <option value="heavy" ${char.weaponSize === 'heavy' ? 'selected' : ''}>Тяж</option>
      </select></td>
      <td><input type="checkbox" ${char.fencing ? 'checked' : ''} onchange="updateChar(${idx}, 'fencing', this.checked)" title="Фехтовальное: точность PER, урон PER+REF"></td>
      <td><input type="checkbox" ${char.dual ? 'checked' : ''} onchange="updateChar(${idx}, 'dual', this.checked)"></td>
      <td><input type="checkbox" ${char.mechanical ? 'checked' : ''} onchange="updateChar(${idx}, 'mechanical', this.checked); renderTable();"></td>
      <td><input type="checkbox" ${char.dualSkill ? 'checked' : ''} onchange="updateChar(${idx}, 'dualSkill', this.checked)"></td>
      <td><input type="checkbox" ${char.ignorePenalty ? 'checked' : ''} onchange="updateChar(${idx}, 'ignorePenalty', this.checked)"></td>
      <td><select onchange="updateChar(${idx}, 'armor', this.value)">
        <option value="none" ${char.armor === 'none' ? 'selected' : ''}>Нет</option>
        <option value="light" ${char.armor === 'light' ? 'selected' : ''}>Лёгк</option>
        <option value="medium" ${char.armor === 'medium' ? 'selected' : ''}>Сред</option>
        <option value="heavy" ${char.armor === 'heavy' ? 'selected' : ''}>Тяж</option>
      </select></td>
      <td><select onchange="updateChar(${idx}, 'shield', this.value)">
        <option value="none" ${char.shield === 'none' ? 'selected' : ''}>Нет</option>
        <option value="small" ${char.shield === 'small' ? 'selected' : ''}>Мал</option>
        <option value="medium" ${char.shield === 'medium' ? 'selected' : ''}>Сред</option>
        <option value="large" ${char.shield === 'large' ? 'selected' : ''}>Бол</option>
      </select></td>
      <td><select onchange="updateChar(${idx}, 'amulet', this.value)">
        <option value="none" ${char.amulet === 'none' ? 'selected' : ''}>Нет</option>
        <option value="amulet" ${char.amulet === 'amulet' ? 'selected' : ''}>Амут</option>
        <option value="talisman" ${char.amulet === 'talisman' ? 'selected' : ''}>Тал</option>
        <option value="apotrop" ${char.amulet === 'apotrop' ? 'selected' : ''}>Апо</option>
      </select></td>
      <td><input type="number" value="${char.dmgBonus ?? 0}" onchange="updateChar(${idx}, 'dmgBonus', this.value)"></td>
      <td><input type="number" value="${char.accBonus ?? 0}" onchange="updateChar(${idx}, 'accBonus', this.value)"></td>
      <td><input type="number" value="${char.customPhys ?? ''}" placeholder="физ" onchange="updateChar(${idx}, 'customPhys', this.value)"></td>
      <td><input type="number" value="${char.customMag ?? ''}" placeholder="маг" onchange="updateChar(${idx}, 'customMag', this.value)"></td>
      <td><button class="btn-danger" onclick="removeCharacter(${idx})">X</button></td>
    `;
        tbody.appendChild(tr);
    });
}

function updateChar(index, field, value) {
    if (characters[index]) characters[index][field] = value;
}

function removeCharacter(index) {
    characters.splice(index, 1);
    renderTable();
}

function addCharacter() {
    characters.push({
        name: 'Новый',
        side: 1,
        str: 10,
        end: 10,
        per: 10,
        ref: 10,
        mag: 10,
        wil: 10,
        det: 10,
        weaponType: 'melee',
        weaponSize: 'light',
        fencing: false,
        dual: false,
        mechanical: false,
        dualSkill: false,
        ignorePenalty: false,
        armor: 'none',
        shield: 'none',
        amulet: 'none',
        dmgBonus: 0,
        accBonus: 0,
        customPhys: '',
        customMag: '',
        hpOverride: '',
        hpBonus: 0,
        endBonus: 0,
        refBonus: 0,
        wilBonus: 0,
        detBonus: 0
    });
    renderTable();
}

function showPrevLog() {
    if (currentLogIndex > 0) {
        currentLogIndex--;
        displayLogByIndex(currentLogIndex);
        updateLogNavButtons();
    }
}

function showNextLog() {
    if (currentLogIndex < battleLogsHistory.length - 1) {
        currentLogIndex++;
        displayLogByIndex(currentLogIndex);
        updateLogNavButtons();
    }
}

function displayLogByIndex(index) {
    const logEl = document.getElementById('battle-log');
    if (!logEl) return;
    const logText = battleLogsHistory[index] || '';
    logEl.innerHTML = formatLogText(logText);
    document.getElementById('log-index-display').innerText = `${index+1}/${battleLogsHistory.length}`;
}

function updateLogNavButtons() {
    document.getElementById('prev-log-btn').disabled = (currentLogIndex <= 0);
    document.getElementById('next-log-btn').disabled = (currentLogIndex >= battleLogsHistory.length - 1);
}

function formatLogText(rawLog) {
    return rawLog.split('\n').map(l =>
        l.includes('[НОКАУТ!]') ? `<div class="log-entry log-damage">${l}</div>` :
            l.includes('[DAMAGE]') ? `<div class="log-entry log-damage">${l}</div>` :
                l.includes('[ДЕМОРАЛИЗАЦИЯ]') ? `<div class="log-entry log-debuff">${l}</div>` :
                    l.includes('ПОПАДАНИЕ') ? `<div class="log-entry">${l}</div>` :
                        l.includes('ПРОМАХ') ? `<div class="log-entry log-miss">${l}</div>` :
                            l.includes('РАУНД') ? `<div class="log-turn">${l}</div>` :
                                `<div class="log-entry">${l}</div>`
    ).join('');
}

class SimActor {
    constructor(data, id) {
        this.id = id;
        this.name = data.name;
        this.side = data.side;
        this.base = {
            ...data
        };
        this.currentHp = this.calculateMaxHp();
        this.maxHp = this.currentHp;
        this.isDowned = false;
        this.hasMoved = false;
        this.hasAttacked = false;
        this.needsReload = false;

        this.nextRollBonus = 0;
        this.incomingAttackPenalty = 0;
        this.demoralized = false;

        this.defenseStanceBonus = 0;
        this.usedFullDefenseLastTurn = false;

        this.motivationUsed = false;
        this.demoralizationUsed = false;

        this.successfulMeleeDefenses = 0;

        this.engagedEnemyId = null;
    }

    calculateMaxHp() {
        const d = this.base;
        const end = safe(d.end) + safe(d.endBonus);
        if (d.hpOverride !== undefined && d.hpOverride !== '') return safe(d.hpOverride);
        return BASE_HP + end + safe(d.hpBonus);
    }

    getStats() {
        const d = this.base;
        const str = safe(d.str);
        const end = safe(d.end) + safe(d.endBonus);
        const per = safe(d.per);
        const ref = safe(d.ref) + safe(d.refBonus);
        const mag = safe(d.mag);
        const wil = safe(d.wil) + safe(d.wilBonus);
        const det = safe(d.det) + safe(d.detBonus);

        const ignorePen = d.ignorePenalty === true;
        const armor = armorData[d.armor] || armorData.none;
        const shield = shieldData[d.shield] || shieldData.none;
        const defPenalty = ignorePen ? 0 : armor.defPenalty;
        const dodgePenalty = ignorePen ? 0 : armor.dodgePenalty;
        let physArmor = armor.phys;
        if (d.customPhys !== undefined && d.customPhys !== '') physArmor = safe(d.customPhys);
        let magArmor = (amuletData[d.amulet] ? amuletData[d.amulet].mag : 0);
        if (d.customMag !== undefined && d.customMag !== '') magArmor = safe(d.customMag);
        return {
            str,
            end,
            per,
            ref,
            mag,
            wil,
            det,
            armor,
            shield,
            defPenalty,
            dodgePenalty,
            ignorePen,
            physArmor,
            magArmor
        };
    }

    getAccuracyDetails(weaponType, attackType) {
        const s = this.getStats();
        const d = this.base;
        let base = 0;

        if (weaponType === 'melee') base = d.fencing ? s.per : s.str;
        else if (weaponType === 'ranged') base = s.per;
        else if (weaponType === 'magic') base = s.mag;

        let typeMod = 0;

        if (attackType === 'accurate' || attackType === 'aimed') {
            typeMod = +4;
        }
        if (attackType === 'powerful' || attackType === 'piercing') {
            typeMod = -4;
        }
        if (attackType === 'flurry') {
            typeMod = -4;
        }

        if (d.mechanical && weaponType === 'ranged') {
            typeMod = 0;
        }

        const weaponMod = (weaponMods[weaponType] && weaponMods[weaponType][d.weaponSize]) || 0;
        const effects = this.nextRollBonus - this.incomingAttackPenalty - (this.demoralized ? 10 : 0);
        const total = base + typeMod + safe(d.accBonus) + effects;

        return {
            total,
            base,
            typeMod,
            accBonus: safe(d.accBonus),
            effects,
            details: {
                rollBonus: this.nextRollBonus,
                penalty: this.incomingAttackPenalty,
                demoralized: this.demoralized ? 10 : 0
            }
        };
    }

    getDamage(weaponType, weaponSize, attackType, isDualSecondHit) {
        const s = this.getStats();
        const d = this.base;
        let baseDmg = 0;

        if (d.mechanical && weaponType === 'ranged') {
            baseDmg = fixedRangedDamage[weaponSize] || 0;
        } else {
            if (weaponType === 'melee') {
                if (d.fencing) {
                    baseDmg = Math.floor((s.per + s.ref) / 4);
                } else {
                    baseDmg = Math.floor((s.str + s.end) / 4);
                }
            } else if (weaponType === 'ranged') {
                baseDmg = Math.floor((s.per + s.ref) / 4);
            } else if (weaponType === 'magic') {
                baseDmg = Math.floor((s.mag + s.wil) / 4);
            }

            let wMod = (weaponMods[weaponType] && weaponMods[weaponType][weaponSize]) || 0;

            if (attackType === 'powerful' || attackType === 'piercing') {
                wMod += 4;
            }
            if (attackType === 'flurry') {
                wMod += 6;
            }
            if (attackType === 'accurate' || attackType === 'aimed') {
                wMod -= 4;
            }

            baseDmg += wMod;
        }

        baseDmg += safe(d.dmgBonus);
        if (isDualSecondHit) baseDmg = Math.floor(baseDmg / 2);

        return Math.max(1, baseDmg);
    }

    getDefenseDetails(type, enemyWeaponType) {
        const s = this.getStats();
        let baseStat = 0;
        let shieldMod = 0;
        let penalty = 0;
        let possible = false;

        if (type === 'parry') {
            if (enemyWeaponType === 'magic') return null;
            if (this.base.weaponType === 'melee' || this.base.shield !== 'none') {
                baseStat = s.end;
                shieldMod = s.shield.parry;
                penalty = s.defPenalty;
                possible = true;
            }
        } else if (type === 'dodge') {
            if (s.armor.dodgePossible && s.shield.dodgePossible) {
                baseStat = s.ref;
                penalty = s.dodgePenalty;
                possible = true;
            }
        } else if (type === 'block') {
            if (enemyWeaponType === 'melee') return null;
            if (s.shield.blockRanged) {
                baseStat = s.end;
                shieldMod = s.shield.block;
                penalty = s.defPenalty;
                possible = true;
            }
        } else if (type === 'will') {
            baseStat = s.wil;
            possible = true;
        } else if (type === 'det') {
            baseStat = s.det;
            possible = true;
        }

        if (!possible) return null;

        const effects = this.nextRollBonus + this.defenseStanceBonus - (this.demoralized ? 10 : 0);
        const total = baseStat + shieldMod + penalty + effects;

        return {
            total,
            baseStat,
            shieldMod,
            penalty,
            effects,
            details: {
                rollBonus: this.nextRollBonus,
                stanceBonus: this.defenseStanceBonus,
                demoralized: this.demoralized ? 10 : 0
            }
        };
    }

    consumeBonuses() {
        if (this.nextRollBonus !== 0) {
            this.nextRollBonus = 0;
        }
        if (this.incomingAttackPenalty !== 0) {
            this.incomingAttackPenalty = 0;
        }
        if (this.demoralized) {
            this.demoralized = false;
        }
    }

    resetRoundState() {
        this.successfulMeleeDefenses = 0;
    }
}

function rollDice() {
    return Math.floor(Math.random() * 20) + 1;
}

function resolveContest(attDetails, defDetails) {
    const attTotal = attDetails.total;
    const defTotal = defDetails.total;
    let rolls = 0;
    const maxRolls = 10;

    while (rolls < maxRolls) {
        const rollA = rollDice();
        const rollD = rollDice();
        rolls++;

        const critA = (rollA === 20);
        const critF = (rollA === 1);
        const critDA = (rollD === 20);
        const critDF = (rollD === 1);

        const finalAtt = rollA + attTotal;
        const finalDef = rollD + defTotal;

        if (critA && !critDA) return {
            winner: 'attack',
            rollA,
            rollD,
            finalAtt,
            finalDef,
            isCrit: true
        };
        if (critF && !critDF) return {
            winner: 'defense',
            rollA,
            rollD,
            finalAtt,
            finalDef,
            isCritFail: true
        };
        if (critDA && !critA) return {
            winner: 'defense',
            rollA,
            rollD,
            finalAtt,
            finalDef,
            isCrit: true
        };
        if (critDF && !critF) return {
            winner: 'attack',
            rollA,
            rollD,
            finalAtt,
            finalDef,
            isCritFail: true
        };

        if ((critA && critDA) || (critF && critDF)) {
            if (attTotal > defTotal) return {
                winner: 'attack',
                rollA,
                rollD,
                finalAtt,
                finalDef,
                tieBreak: true
            };
            if (defTotal > attTotal) return {
                winner: 'defense',
                rollA,
                rollD,
                finalAtt,
                finalDef,
                tieBreak: true
            };
            continue;
        }

        if (finalAtt > finalDef) return {
            winner: 'attack',
            rollA,
            rollD,
            finalAtt,
            finalDef
        };
        if (finalDef > finalAtt) return {
            winner: 'defense',
            rollA,
            rollD,
            finalAtt,
            finalDef
        };
        continue;
    }

    return {
        winner: 'defense',
        rollA: 0,
        rollD: 0,
        finalAtt: 0,
        finalDef: 0,
        timeout: true
    };
}

class BattleSimulator {
    constructor(charsData, aiLevel, logCallback) {
        this.actors = charsData.map((d, i) => new SimActor(d, i));
        this.aiLevel = aiLevel;
        this.log = logCallback || (() => {});
        this.turnOrder = [];
        this.round = 0;
    }

    init() {
        this.actors.forEach(a => {
            a.initRoll = rollDice();
        });
        this.turnOrder = [...this.actors].sort((a, b) => b.initRoll - a.initRoll);
        this.round = 0;
        this.log(`--- БОЙ НАЧАЛСЯ ---`);
        this.log(`Инициатива: ${this.turnOrder.map(a => `${a.name}(${a.initRoll})`).join(' -> ')}`);
    }

    isBattleOver() {
        const p = this.actors.filter(a => a.side === 1 && !a.isDowned).length;
        const e = this.actors.filter(a => a.side === 2 && !a.isDowned).length;
        if (p === 0) return 'enemies_win';
        if (e === 0) return 'players_win';
        return null;
    }

    run() {
        this.init();
        let result = null;
        const maxRounds = 50;

        while (!result && this.round < maxRounds) {
            this.round++;
            result = this.isBattleOver();
            if (result) break;

            this.log(`\n=== РАУНД ${this.round} ===`);

            this.actors.forEach(a => {
                a.resetRoundState();
                a.hasMoved = false;
                a.hasAttacked = false;
            });

            for (let actor of this.turnOrder) {
                if (actor.isDowned) continue;
                result = this.isBattleOver();
                if (result) break;
                this.takeTurn(actor);
            }
        }

        return result || 'draw';
    }

    takeTurn(actor) {
        const enemies = this.actors.filter(a => a.side !== actor.side && !a.isDowned);
        const allies = this.actors.filter(a => a.side === actor.side && !a.isDowned);

        if (enemies.length === 0) return;

        this.log(`\nХод: ${actor.name} (HP: ${actor.currentHp}/${actor.maxHp})`);

        if (actor.defenseStanceBonus > 0) {
            this.log(`  [INFO] Эффект Глухой обороны у ${actor.name} истек.`);
            actor.defenseStanceBonus = 0;
        }
        actor.usedFullDefenseLastTurn = false;

        if (actor.base.mechanical && actor.needsReload) {
            this.log(`  [INFO] ${actor.name} перезаряжает оружие.`);
            actor.needsReload = false;
            actor.hasAttacked = true;
            actor.consumeBonuses();
            return;
        }

        let target = null;
        let actionType = 'attack';
        let attackSubType = 'normal';
        let useMotivation = false;
        let useDemoralize = false;
        let useFullDefense = false;

        const isMelee = actor.base.weaponType === 'melee';
        const allEnemiesRanged = enemies.every(e => e.base.weaponType === 'ranged' || e.base.weaponType === 'magic');
        const isEngaged = actor.engagedEnemyId !== null && enemies.some(e => e.id === actor.engagedEnemyId);
        const needsMovement = (isMelee && allEnemiesRanged && !isEngaged);

        const hpPercent = actor.currentHp / actor.maxHp;
        const isLowHp = hpPercent < 0.3;
        const easyKill = enemies.find(e => e.currentHp <= 10);

        if (this.aiLevel === 'coordinated' && !actor.motivationUsed && allies.length > 1 && !easyKill) {
            const bestAlly = allies.filter(a => a !== actor).sort((a, b) => (b.getStats().str + b.getStats().mag) - (a.getStats().str + a.getStats().mag))[0];
            if (bestAlly) {
                target = bestAlly;
                useMotivation = true;
                this.log(`  [BUFF] Мотивация на ${target.name}`);
            }
        }

        if (!useMotivation && this.aiLevel !== 'basic' && !actor.demoralizationUsed && !easyKill && this.round > 1) {
            const dangerousEnemy = enemies.sort((a, b) => (b.getStats().str + b.getStats().mag) - (a.getStats().str + a.getStats().mag))[0];
            if (dangerousEnemy) {
                target = dangerousEnemy;
                useDemoralize = true;
                this.log(`  [DEBUFF] Деморализация ${target.name}`);
            }
        }

        if (!useMotivation && !useDemoralize) {
            target = easyKill || enemies.sort((a, b) => a.currentHp - b.currentHp)[0];

            if (needsMovement) {
                actionType = 'move_attack';
                this.log(`  [MOVE] ${actor.name} бежит к ${target.name} для сближения.`);
            } else {
                if (isLowHp && !easyKill && this.aiLevel !== 'basic') {
                    if (!actor.usedFullDefenseLastTurn && Math.random() > 0.5) {
                        useFullDefense = true;
                        this.log(`  [DEFENSE] Низкое HP! Глухая оборона.`);
                    } else {
                        attackSubType = (actor.base.weaponType === 'melee') ? 'powerful' : 'piercing';
                        this.log(`  [ATTACK] Низкое HP, но атакуем насмерть!`);
                    }
                } else {
                    if (this.aiLevel !== 'basic') {
                        const defDet = target.getDefenseDetails('parry', actor.base.weaponType);
                        const dodgeDet = target.getDefenseDetails('dodge', actor.base.weaponType);
                        const blockDet = target.getDefenseDetails('block', actor.base.weaponType);
                        const maxDef = Math.max(
                            defDet ? defDet.total : -999,
                            dodgeDet ? dodgeDet.total : -999,
                            blockDet ? blockDet.total : -999
                        );
                        const accDet = actor.getAccuracyDetails(actor.base.weaponType, 'normal');

                        if (maxDef > accDet.total + 2) {
                            if (actor.base.weaponType === 'ranged') {
                                attackSubType = 'aimed';
                                this.log(`  [TACTICS] Прицельный выстрел (Защита ${maxDef} > Точность ${accDet.total})`);
                            } else if (actor.base.weaponType === 'magic') {
                                attackSubType = 'aimed';
                                this.log(`  [TACTICS] Быстрое заклинание (Защита ${maxDef} > Точность ${accDet.total})`);
                            } else {
                                attackSubType = 'accurate';
                                this.log(`  [TACTICS] Точный удар (Защита ${maxDef} > Точность ${accDet.total})`);
                            }
                        } else if (target.getStats().physArmor >= 4 || (accDet.total - maxDef >= 5)) {
                            if (actor.base.weaponType === 'ranged') {
                                attackSubType = 'piercing';
                                this.log(`  [TACTICS] Пробивной выстрел (Броня ${target.getStats().physArmor} или запас точности)`);
                            } else if (actor.base.weaponType === 'magic') {
                                attackSubType = 'piercing';
                                this.log(`  [TACTICS] Мощное заклинание (Броня ${target.getStats().physArmor} или запас точности)`);
                            } else {
                                attackSubType = 'powerful';
                                this.log(`  [TACTICS] Сильный удар (Броня ${target.getStats().physArmor} или запас точности)`);
                            }
                        }
                    }
                }
            }
        }

        if (useMotivation) {
            actor.motivationUsed = true;
            target.nextRollBonus += 10;
            this.log(`  [EFFECT] ${target.name} получает +10.`);
            actor.hasAttacked = true;
            actor.consumeBonuses();
        } else if (useDemoralize) {
            actor.demoralizationUsed = true;

            const attDet = actor.getAccuracyDetails('magic', 'normal');
            const defDet = target.getDefenseDetails('det', actor.base.weaponType);

            const attStats = actor.getStats();
            const defStats = target.getStats();

            const attBase = attStats.det || 5;

            const defBase = defStats.det || 5;

            const attEffects = actor.nextRollBonus - actor.incomingAttackPenalty - (actor.demoralized ? 10 : 0);
            const defEffects = target.nextRollBonus + target.defenseStanceBonus - (target.demoralized ? 10 : 0);

            const attTotal = attBase + attEffects;
            const defTotal = defBase + defEffects;

            const rollA = rollDice();
            const rollD = rollDice();
            const finalAtt = rollA + attTotal;
            const finalDef = rollD + defTotal;

            this.log(`  [ДЕМОРАЛИЗАЦИЯ] ${actor.name} vs ${target.name}:`);
            this.log(`    Атакующий: Кубик [${rollA}] + ${attBase} (DET) ${attEffects !== 0 ? (attEffects >= 0 ? '+' : '') + attEffects + ' (Эфф)' : ''} = ${finalAtt}`);
            this.log(`    Защита: Кубик [${rollD}] + ${defBase} (DET) ${defEffects !== 0 ? (defEffects >= 0 ? '+' : '') + defEffects + ' (Эфф)' : ''} = ${finalDef}`);

            if (finalAtt > finalDef) {
                target.demoralized = true;
                this.log(`  [EFFECT] ${target.name} ДЕМОРАЛИЗОВАН (-10 к следующему броску).`);
            } else {
                this.log(`  [RESIST] ${target.name} сопротивился.`);
            }

            actor.hasAttacked = true;
            actor.consumeBonuses();
            target.consumeBonuses();
        } else if (useFullDefense) {
            actor.usedFullDefenseLastTurn = true;
            actor.defenseStanceBonus = 5;
            actor.hasAttacked = true;
            actor.hasMoved = true;
            this.log(`  [ACTION] Глухая оборона (+5 к защите).`);
            actor.consumeBonuses();
        } else if (actionType === 'move_attack') {
            actor.hasMoved = true;
            actor.engagedEnemyId = target.id;
            this.log(`  [MOVE] ${actor.name} сближается с ${target.name} и атакует.`);
            this.performAttack(actor, target, 'normal');
        } else {
            this.performAttack(actor, target, attackSubType);
        }
    }

    performAttack(attacker, defender, attackType) {
        attacker.hasAttacked = true;

        const isDual = attacker.base.dual;
        const isDualSkill = attacker.base.dualSkill;
        const canDualSecond = (isDual && attacker.base.weaponSize === 'light') || (isDual && isDualSkill);
        const movedThisTurn = attacker.hasMoved;

        const isSpecialAttack = (attackType === 'powerful' || attackType === 'accurate' || attackType === 'flurry' || attackType === 'piercing' || attackType === 'aimed');
        const allowDualSecond = canDualSecond && !movedThisTurn && !isSpecialAttack;

        let attacks = [{
            isSecond: false
        }];
        if (allowDualSecond) {
            attacks.push({
                isSecond: true
            });
        }

        attacks.forEach((atk, idx) => {
            if (attacker.isDowned || defender.isDowned) return;

            const isMeleeAttack = attacker.base.weaponType === 'melee';
            const defenseLimitExceeded = isMeleeAttack && defender.successfulMeleeDefenses >= 2;

            let hit = false;
            let res = null;
            let isGuaranteed = false;
            let usedAttackType = attackType;

            if (defenseLimitExceeded) {
                hit = true;
                isGuaranteed = true;
                usedAttackType = 'normal';
                this.log(`  [ГАРАНТ] ${attacker.name} автоматически попадает (лимит защит ${defender.name}).`);
            } else {
                const attDet = attacker.getAccuracyDetails(attacker.base.weaponType, attackType);

                const parryDet = defender.getDefenseDetails('parry', attacker.base.weaponType);
                const dodgeDet = defender.getDefenseDetails('dodge', attacker.base.weaponType);
                const blockDet = defender.getDefenseDetails('block', attacker.base.weaponType);
                const willDet = defender.getDefenseDetails('will', attacker.base.weaponType);

                let defType = 'will';
                let defDet = willDet;

                if (attacker.base.weaponType === 'magic' && defender.base.weaponType === 'magic') {
                    defType = 'counter';
                } else if (attacker.base.weaponType !== 'magic') {
                    const options = [{
                        t: 'parry',
                        d: parryDet
                    },
                        {
                            t: 'dodge',
                            d: dodgeDet
                        },
                        {
                            t: 'block',
                            d: blockDet
                        }
                    ].filter(o => o.d !== null);

                    if (options.length > 0) {
                        options.sort((a, b) => b.d.total - a.d.total);
                        defType = options[0].t;
                        defDet = options[0].d;
                    }
                }

                res = resolveContest(attDet, defDet);
                hit = (res.winner === 'attack');

                const attStr = `Кубик [${res.rollA}] + ${attDet.base} (Характеристика) ${attDet.typeMod >= 0 ? '+' : ''}${attDet.typeMod} (Тип) ${attDet.effects !== 0 ? (attDet.effects >= 0 ? '+' : '') + attDet.effects + ' (Эфф)' : ''} = ${res.finalAtt}`;

                const defParts = [];
                defParts.push(`${defDet.baseStat} (Характеристика)`);
                if (defDet.shieldMod) defParts.push(`${defDet.shieldMod} (Щит)`);
                if (defDet.penalty) defParts.push(`${defDet.penalty} (Штр)`);
                if (defDet.effects) defParts.push(`${defDet.effects >= 0 ? '+' : ''}${defDet.effects} (Эфф)`);
                const defStr = `Кубик [${res.rollD}] + ${defParts.join(' ')} = ${res.finalDef}`;

                let logMsg = `  [ATTACK] ${attacker.name} vs ${defender.name} (${attackType}): ${attStr} vs ${defStr} -> `;

                if (hit) {
                    logMsg += `ПОПАДАНИЕ${res.isCrit ? ' (КРИТ!)' : ''}`;
                } else {
                    logMsg += `ПРОМАХ${res.isCritFail ? ' (КРИТ-ПРОВАЛ!)' : ''}`;
                    if (defType === 'dodge') {
                        defender.nextRollBonus += 5;
                        logMsg += ` | Уклонение!`;
                    } else if (defType === 'parry') {
                        attacker.incomingAttackPenalty += 5;
                        logMsg += ` | Парирование!`;
                    } else if (defType === 'counter') {
                        attacker.incomingAttackPenalty += 5;
                        logMsg += ` | Контрзаклинание!`;
                    }
                }
                this.log(logMsg);

                if (!hit && isMeleeAttack) {
                    defender.successfulMeleeDefenses++;
                    this.log(`  [DEF COUNT] ${defender.name}: ${defender.successfulMeleeDefenses}/2`);
                }

                attacker.consumeBonuses();
                defender.consumeBonuses();
            }

            if (hit || isGuaranteed) {
                let dmg = attacker.getDamage(attacker.base.weaponType, attacker.base.weaponSize, usedAttackType, atk.isSecond);
                const armorVal = (attacker.base.weaponType === 'magic') ? defender.getStats().magArmor : defender.getStats().physArmor;
                const actualDmg = Math.max(1, dmg - armorVal);

                defender.currentHp -= actualDmg;
                let logMsg = `  [DAMAGE] Урон: ${dmg} - ${armorVal} = ${actualDmg}. HP: ${defender.currentHp}`;
                if (isGuaranteed) logMsg = `  [ГАРАНТ] ` + logMsg;
                this.log(logMsg);

                if (defender.currentHp <= 0) {
                    defender.isDowned = true;
                    defender.currentHp = 0;
                    this.log(`  [НОКАУТ!] ${defender.name} повержен!`);
                    if (attacker.engagedEnemyId === defender.id) {
                        attacker.engagedEnemyId = null;
                    }
                }
            }

            if (attacker.base.mechanical && attacker.base.weaponType === 'ranged' && idx === 0) {
                if (!attacker.hasMoved) {
                    this.log(`  [RELOAD] Мгновенная перезарядка.`);
                } else {
                    attacker.needsReload = true;
                    this.log(`  [WARNING] Нужна перезарядка в след. ход.`);
                }
            }
        });
    }
}

function runSimulationBatch() {
    const count = parseInt(document.getElementById('sim-count').value) || 500;
    const aiLevel = document.getElementById('ai-difficulty').value;

    if (characters.length < 2) {
        alert("Нужно минимум 2 персонажа!");
        return;
    }

    let playerWins = 0,
        totalRounds = 0;
    let logs = [];

    for (let i = 0; i < count; i++) {
        let lastLog = "";
        const logCallback = (msg) => {
            lastLog += msg + "\n";
        };
        const sim = new BattleSimulator(characters, aiLevel, logCallback);
        const res = sim.run();
        if (res === 'players_win') playerWins++;
        totalRounds += sim.round;

        if (i >= count - MAX_HISTORY) {
            logs.push(lastLog);
        }
    }

    battleLogsHistory = logs.slice(-MAX_HISTORY);
    currentLogIndex = battleLogsHistory.length - 1;

    const winRate = (playerWins / count) * 100;
    document.getElementById('sim-runs-display').innerText = count;
    const wrEl = document.getElementById('win-rate');
    wrEl.innerText = winRate.toFixed(1) + '%';
    wrEl.style.color = winRate > 50 ? '#a5d6a5' : '#ef9a9a';
    document.getElementById('avg-rounds').innerText = (totalRounds / count).toFixed(1) + ' раундов';

    const catEl = document.getElementById('battle-category');
    let cat = 'category-balanced',
        txt = 'Равный бой';
    if (winRate > 80) {
        cat = 'category-easy';
        txt = 'Лёгкий бой';
    } else if (winRate <= 25) {
        cat = 'category-deadly';
        txt = 'Смертельный бой';
    } else if (winRate <= 45) {
        cat = 'category-hard';
        txt = 'Трудный бой';
    }
    catEl.className = `category ${cat}`;
    catEl.innerText = txt;

    document.getElementById('results').style.display = 'block';

    let tacticText = '';
    if (aiLevel === 'basic') tacticText = 'Хаотичная';
    else if (aiLevel === 'tactical') tacticText = 'Оптимальная';
    else if (aiLevel === 'coordinated') tacticText = 'Координированная';
    document.getElementById('stats-details').innerHTML = `
    <p>Побед игроков: <strong>${playerWins}</strong></p>
    <p>Тактика: <strong>${tacticText}</strong></p>
  `;

    if (battleLogsHistory.length > 0) {
        displayLogByIndex(currentLogIndex);
        updateLogNavButtons();
    }
}

window.onload = function() {
    initExamples();
};