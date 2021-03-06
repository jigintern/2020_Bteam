// <script src="./js/profile.js" type="module" charset="utf-8"></script>
import { fetchJSON } from "https://code4sabae.github.io/js/fetchJSON.js";

//プロフィール画面表示
window.OpenProfile = async (place) => {
    let name,gender,age,weight;
    const { value: profile } = await Swal.fire({
        title: 'プロフィール',
        //入力フォームHTML
        html:
        '<input class="swal2-input" placeholder="名前" id="name" maxlength="10" autocapitalize="off" autocorrect="off">' +
        '<p class="prop">性別</p>' +
        '<div calss="swal2-radio">' +
            '<form id="radi">' +
            '<label>' +
                '<input type="radio" name="swal2radio" value="male" checked="checked" id="man">' +
                '<span class="swal2-label" id="lman">男性</span>' +
            '</label>' +
            '<label>' +
                '<input type="radio" name="swal2radio" value="female" id="woman">' +
                '<span class="swal2-label" id="lwoman">女性</span>' +
            '</label>' +
            '</form>' +
        '</div>' +
        '<p class="prop" id="out1">年齢：20歳</p>' +
        '<div calss="swal2-range">' +
            '<input type="range" value="20" min="10" max="60" step="1" oninput="this.style.background = `linear-gradient(to right, #69c4c3 0%, #69c4c3 ${(this.value-10)*2}%, #a9a9a9 ${(this.value-10)*2}%, #a9a9a9 100%)`;out1.innerHTML=`年齢：${this.value}歳`" id="rang1" class="rang">' +
        '</div>' +
        '<p class="prop" id="out2">体重：40kg</p>' +
        '<div calss="swal2-range">' +
            '<input type="range" value="40" min="20" max="120" step="1" oninput="this.style.background = `linear-gradient(to right, #69c4c3 0%, #69c4c3 ${this.value-20}%, #a9a9a9 ${this.value-20}%, #a9a9a9 100%)`;out2.innerHTML=`体重：${this.value}kg`" id="rang2" class="rang">' +
        '</div><br>' ,
        confirmButtonText: '保存',
        //allowOutsideClick : false,
        preConfirm: () => {
            return [
                document.getElementById('name').value,
                document.getElementById('radi').swal2radio.value,
                document.getElementById('rang1').value,
                document.getElementById('rang2').value
            ]
        },
    });
    //取得値表示
    if (profile) {
        name = profile[0];
        gender = profile[1];
        age = profile[2];
        weight = profile[3];
        const pattern = new RegExp(/[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/g);
        //console.log(pattern.test(name));
        if(name){
            if (pattern.test(name)) {
                Swal.fire({
                    icon: 'error',
                    title: '記号は入力できません。',
                    timer: 2000,
                    timerProgressBar: true,
                    onOpen: (err) => {
                        err.addEventListener('mouseenter', Swal.stopTimer)
                        err.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
            }else{
                //サーバーへのユーザーIDの送信
                const req1 = { id: name, num: 0 };
                await fetchJSON("/api/data", req1);
                //サーバーへのプロフィールの送信
                const req2 = { id: name, ftm: gender, age: age, wt: weight };
                await fetchJSON("/api/user", req2);
                //パラメータ更新
                param["name"] = name;
                //cookie保存
                document.cookie = "name=" + name;
                //HTMLの更新
                move(place,"name");
            }
        }
    }
};

window.OpenMission = async () => {
    const req = { id: param["name"] };
    //ミッションをjsonNo配列で返す
    const res = await fetchJSON("/api/getmission", req);
    let html =
    '<table id="mis" align="center">' +
    '<tr>' +
        '<th class="mid">内容</th>' +
        '<th class="mid rate">レート</th>' +
    '</tr>';

    let tr, td;
    for (let i = 0; res.length > i; i++) {
    html += `<td class="nai">${res[i].menu}を${res[i].var}回する</td>`;
    html += `<td class="nai">+${res[i].var * 10}</td>`;
    html += '<tr></tr>';
    }
    html += '</table>';

    if (param["name"]){
    setup.innerHTML = param["name"];
    }

    Swal.fire({
    title: 'ミッション',
    html: html,
    confirmButtonText: 'OK',
    })
};