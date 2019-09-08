$(document).ready(function() {

    let theme = "dark";
    if(Cookies.get('sel_theme') === theme){
        DarkReader.enable({
			brightness: 100,
			contrast: 100,
			sepia: 0
        });

        $('#darkMode').fadeOut().delay(300).addClass('d-none');
        $('#lightMode')
            .hide()
            .removeClass('d-none')
            .fadeIn();
    }

    $('#darkMode').click(function(){
        Cookies.set('sel_theme', 'dark');

        DarkReader.enable({
			brightness: 100,
			contrast: 100,
			sepia: 0
        });
        
        $(this).fadeOut().delay(300).addClass('d-none');
        $('#lightMode')
            .hide()
            .removeClass('d-none')
            .fadeIn();

        //alert(Cookies.get('sel_theme'));
    });

    $('#lightMode').click(function(){
        Cookies.set('sel_theme', 'light');

        DarkReader.disable();

        $(this).fadeOut().delay(300).addClass('d-none');
        $('#darkMode')
            .hide()
            .removeClass('d-none')
            .fadeIn();

        //alert(Cookies.get('sel_theme'));
    });

    //$('#resultModal').modal('toggle');

    //$('#mlqModal').modal('toggle');

    /**
     DarkReader.enable({
        brightness: 100,
        contrast: 100,
        sepia: 0
    });
    
    $(this).fadeOut().delay(300).addClass('d-none');
    $('#lightMode')
        .hide()
        .removeClass('d-none')
        .fadeIn();
     */
    
    //

    var allow_modal = true;

    function all_filled() {
        $('.CPU_INPUT').find('input').each(function(){
            if( $(this).val() == "" ){
                //alert('Please fill all the fields ' + $(this).text());

                allow_modal = false;

                $('#alert')
                .clone().prependTo($('#alert').parent())
                .fadeIn().removeClass('d-none').delay(15).fadeOut();

                return false;
            }
        });

        return true;
    }

    $('#algorithm').change(function(){
        let rrIn = "my-2 col-12 col-lg-5 col-md-8 col-lg-5 col-xl-3";
        let rrOut = "my-2 col-12 col-lg-5 col-md-12 col-lg-8 col-xl-5";
        let val = $(this).val();

        if(val >= 6){
            if(val >= 7){ //MLQ
                $('#mlqClass').addClass("input-group"); //show
                $('#mlqBtnContainer').fadeIn(); 

                $('#quantum').parent().addClass('d-none');
                $('#rrClass').attr('class', rrOut);
            }
            else{ // RR
                $('#quantum').parent().removeClass('d-none'); // show
                $('#rrClass').attr('class', rrIn);

                $('#mlqBtnContainer').hide();
                $('#mlqClass').removeClass("input-group");
            }
        }
        else{
            // MLQ
            $('#mlqBtnContainer').hide();
            $('#mlqClass').removeClass("input-group");

            // RR
            $('#quantum').parent().addClass('d-none');
            $('#rrClass').attr('class', rrOut);
        }
    });

    if($('#algorithm').val() == 7 || $('#algorithm').val() == 8){
        $('#mlqClass').addClass("input-group");
        $('#mlqBtnContainer').fadeIn();
    }


    $('body').on("click", '.deleteRow', function() {
        $(this).parent().parent().parent().remove();
    });

    let newRow = function() {
        $("#inputClone").clone().appendTo('#inputBody')
            .addClass('CPU_INPUT')
            .removeClass('d-none');
    };

    newRow();

    $('#addRow').click(function(){
        newRow();
    });

    $("#addRow").pressAndHold({
        holdTime: 500,
        progressIndicatorRemoveDelay: 100,
        progressIndicatorColor: "blue",
        progressIndicatorOpacity: 0.3
    });

    $("#addRow").on('start.pressAndHold', function(event) {
        console.log("start"); 
    });

    $("#addRow").on('complete.pressAndHold', function(event) {
        $('#rowModal').modal('toggle');
    });

    $("#addRow").on('end.pressAndHold', function(event) {
        console.log("end"); 
    });


    $('#reset').click(function(){
        $('.CPU_INPUT').each(function(){
            $(this).remove();
        });

        newRow();
    });

    let newRow_MLQ = function(){
        $("#mlqInput").clone().appendTo('#mlqBody')
            .addClass('MLQ_INPUT')
            .removeClass('d-none');
    };

    $('#mlqAddRow').click(function(){
        newRow_MLQ();
    });

    newRow_MLQ();

    $('body').on("click", '.mlqDeleteRow', function() {
        $(this).parent().parent().parent().remove();
    });

    $('#resetMLQ').click(function(){
        $('.MLQ_INPUT').each(function(){
            $(this).remove();
        });

        newRow_MLQ();
    });

    



    var ganttChart_MAX = 0;
    var ganttChart = [];
    var et = 0;
    var final_tt = 0;
    var final_wt = 0;
    var process = [];
    var quantum = 0;
    var MAX = 0;
    var p = [];
    var quantum = 0;
    var chartLabel = [];
    var chartData   = [];
    var chartBgColor   = [];
    var chartBdColor   = [];
    var chartColorCtr = 0;

    var chartBgColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ]

    var chartBdColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ]

    function notDone() {
        for (i = 0; i < MAX; i++) {
            if (p[i].bt != 0) {
                return true;
            }
        }
        return false;
    }

    function resetAll() {
        ganttChart_MAX = 0;
        ganttChart = [];
        et = 0;
        final_tt = 0;
        final_wt = 0;
        process = [];
        quantum = 0;
        MAX = 0;
        p = [];

        ganttChart.push({
            name: "",
            bt: "",
            et: 0
        });
        ganttChart_MAX++;

        chartLabel = [];
        chartData   = [];
        chartColorCtr = 0;
        chartBgColor   = [];
        chartBdColor   = [];
    }

    resetAll();

    function checkBt(i) {
        if (p[i].bt == 0) {
            p[i].tt = (et / 100) - (p[i].at / 100);
            p[i].wt = (p[i].tt) - (p[i].bbt / 100);

            final_tt += p[i].tt;
            final_wt += p[i].wt;

            chartBgColor.push(chartBgColors[chartColorCtr]);
            chartBdColor.push(chartBdColors[chartColorCtr]);
            chartLabel.push(p[i].job);
            chartData.push(et/100);

            chartColorCtr++;
            if(chartColorCtr == 6){
                chartColorCtr = 0;
            }

            //console.log("JOB: " + p[i].job  +" | TT: = " + et/100 + " - " + p[i].at/100
            //+ " | WT: = " + p[i].tt + " - " + p[i].bbt/100);
        }
    }

    function pushGanttIdle() {
        ganttChart.push({
            name: 'IDLE',
            bt: '',
            et: et / 100
        });
        ganttChart_MAX++;
    }

    function pushGantt_NPRE(i) {
        ganttChart.push({
            name: p[i].job,
            bt: p[i].bt / 100,
            et: et / 100
        });
        ganttChart_MAX++;
    }

    function pushGantt_PRE(i, bt) {

        ganttChart.push({
            name: p[i].job,
            bt: bt / 100,
            et: et / 100
        });
        ganttChart_MAX++;
    }

    function displayGanttChart() {

        $('.ganttClone').each(function(){
            $(this).remove();
        });
	
	let 
	    
	alert("Author : Gene Adrian V. San Luis  \nBSIT 2 - 4  \nPUP: 2019 - 2020");

        for (let i = 1; i < ganttChart_MAX; i++) {
            $("#ganttClone").clone().appendTo('#ganttDiv')
                .removeClass('d-none')
                .addClass("d-flex ganttClone")
                .attr('id', 'gantt-' + i);

            $('#gantt-' + i).find('#name').text(ganttChart[i].name);
            $('#gantt-' + i).find('#bt').text(ganttChart[i].bt);
            $('#gantt-' + i).find('#et').text(ganttChart[i].et);

        }

        console.log(ganttChart);
    }

    function displayTable() {
        p.sort((a, b) => a.order - b.order);

        $('.gtRowClone').each(function(){
            $(this).remove();
        });

        let i = 0;

        for (i = 0; i < MAX; i++) {
            $("#gtRowClone")
                .clone().appendTo('#gtBody')
                .removeClass('d-none')
                .addClass("gtRowClone d-flex")
                .attr('id', 'gtRow-' + i);

            $('#gtRow-' + i).find('#job').text(p[i].job);
            $('#gtRow-' + i).find('#tt').text(p[i].tt);
            $('#gtRow-' + i).find('#wt').text(p[i].wt);
        }

        $("#gtRowClone")
            .clone().appendTo('#gtBody')
            .removeClass('d-none')
            .addClass("gtRowClone d-flex")
            .attr('id', 'gtRow-' + i);

        $('#gtRow-' + i).find('#job').text("AVERAGE");

        $('#gtRow-' + i).find('#tt')
            .text((final_tt / MAX).toFixed(2))
            .addClass('font-weight-bold');

        $('#gtRow-' + i).find('#wt')
            .text((final_wt / MAX).toFixed(2))
            .addClass('font-weight-bold');

        if(allow_modal){
            $('#resultModal').modal('toggle');

            $('#burstTimeChart').remove();
            $('#bTchartContainer').append('<canvas id="burstTimeChart" width="400" height="240"></canvas>');

            var myChart = new Chart($('#burstTimeChart'), {
                type: 'bar',
                data: {
                    labels: chartLabel,
                    datasets: [{
                        label:              'End Time of Job',
                        data:               chartData,
                        backgroundColor:    chartBgColor,
                        borderColor:        chartBdColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }

    function checkIdle() {
        let flag = true;

        for (let i = 0; i < MAX; i++) {
            if (p[i].at <= et && p[i].bt != 0) {
                flag = false;
            }
        }

        if (flag) {
            let sm = p[0];
            for (i = 0; i < MAX; i++) {
                if (p[i].bt != 0 && (p[i].at < sm.at || sm.bt == 0)) {
                    sm = p[i];
                }
            }

            et = sm.at;

            pushGanttIdle();
        }
    }

    function FCFS() {
        p.sort((a, b) => a.at - b.at);

        for (let i = 0; i < MAX; i++) {
            checkIdle();

            et += p[i].bt;

            pushGantt_NPRE(i);

            p[i].bt = 0;

            checkBt(i);
        }

        et /= 100;

        displayGanttChart();
        displayTable();
    }

    function SJF() {
        while (notDone()) {
            checkIdle();

            let x = [];
            for (let i = 0; i < MAX; i++) {
                if (p[i].at <= et && p[i].bt != 0) {
                    x.push(p[i]);
                }
            }
            x.sort(function(a, b) {
                if ((a.bt > b.bt || (a.bt == b.bt && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                    return 1;
                }
                if (!(a.bt > b.bt || (a.bt == b.bt && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                    return -1;
                }
                return 0;
            });

            let i = x[0].order;

            et += p[i].bt;

            pushGantt_NPRE(i);

            p[i].bt = 0;

            checkBt(i);

            console.log(x[0]);
            //console.log(x);
        }
        et /= 100;

        displayGanttChart();
        displayTable();
    }

    function NPP() {
        while (notDone()) {
            checkIdle();

            let x = [];
            for (let i = 0; i < MAX; i++) {
                if (p[i].at <= et && p[i].bt != 0) {
                    x.push(p[i]);
                }
            }
            x.sort(function(a, b) {
                if ((a.prio > b.prio || (a.prio == b.prio && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                    return 1;
                }
                if (!(a.prio > b.prio || (a.prio == b.prio && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                    return -1;
                }
                return 0;
            });

            let i = x[0].order;

            et += p[i].bt;

            pushGantt_NPRE(i);

            p[i].bt = 0;

            checkBt(i);

            console.log(x[0]);
            //console.log(x);
        }
        et /= 100;

        displayGanttChart();
        displayTable();
    }

    function SRTF() {
        for (let i = 0; i < MAX; i++) {
            p[i].linked = false;
        }

        let x = [];
        let start = true;
        let j = 0;
        let i = 0;
        let accumulated_bt = 0;

        console.log("SRTF");
        while (notDone()) {
            checkIdle();

            x = [];

            for (let i = 0; i < MAX; i++) {
                if (p[i].at <= et && p[i].bt != 0 && p[i].linked == false) {
                    x.push(p[i]);
                    p[i].linked == true;
                }
            }

            x.sort(function(a, b) {
                if ((a.bt > b.bt || (a.bt == b.bt && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                    return 1;
                }
                if (!(a.bt > b.bt || (a.bt == b.bt && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                    return -1;
                }
                return 0;
            });

            i = x[0].order;

            if (start == false) {
                if (j != i) {
                    pushGantt_PRE(j, accumulated_bt);
                    accumulated_bt = 0;
                    checkBt(j);
                }
            }
            start = false;

            p[i].bt -= 1;
            et += 1;
            accumulated_bt += 1;

            if (et % 100 == 0) {
                console.log(p[i]);
            }

            j = i;

            if (notDone() == 0) {
                pushGantt_PRE(j, accumulated_bt);
                checkBt(j);
            }
        }

        et /= 100;

        displayGanttChart();
        displayTable();
    }

    function PP() {
        for (let i = 0; i < MAX; i++) {
            p[i].linked = false;
        }

        let x = [];
        let start = true;
        let j = 0;
        let i = 0;
        let accumulated_bt = 0;

        console.log("SRTF");
        while (notDone()) {
            checkIdle();

            x = [];

            for (let i = 0; i < MAX; i++) {
                if (p[i].at <= et && p[i].bt != 0 && p[i].linked == false) {
                    x.push(p[i]);
                    p[i].linked == true;
                }
            }

            x.sort(function(a, b) {
                if ((a.prio > b.prio || (a.prio == b.prio && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                    return 1;
                }
                if (!(a.prio > b.bt || (a.prio == b.prio && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                    return -1;
                }
                return 0;
            });

            i = x[0].order;

            if (start == false) {
                if (j != i) {
                    pushGantt_PRE(j, accumulated_bt);
                    accumulated_bt = 0;
                    checkBt(j);
                }
            }
            start = false;

            p[i].bt -= 1;
            et += 1;
            accumulated_bt += 1;

            if (et % 100 == 0) {
                console.log(p[i]);
            }

            j = i;

            if (notDone() == 0) {
                pushGantt_PRE(j, accumulated_bt);
                checkBt(j);
            }
        }

        et /= 100;

        displayGanttChart();
        displayTable();
    }

    function RR() {
        console.clear();

        let qq = parseFloat(quantum).toFixed(2);
        let last = 0;
        let x = [];
        const q = qq * 100;

        p.sort((a, b) => a.at - b.at);

        for (let i = 0; i < MAX; i++) {
            p[i].linked = false;
            p[i].rrOrder = i;
        }

        console.log('\n Quantum = ' + q +'\n\n');

        let expected_bt = 0;
        for(let i = 0; i < p.length; i++){
            console.log(p[i]);
            expected_bt += p[i].bt;
        }
        console.log('[Expected ET] = ' + expected_bt/100);

        let ctr = 0;
        
        while (notDone()) {
            checkIdle();

            for (let i = 0; i < MAX; i++) {
                if (p[i].at <= et && p[i].bt != 0 && p[i].linked == false) {
                    x.push(p[i]);
                    //console.log('PUSHING : ' + p[i].job);
                    p[i].linked = true;
                }
            }

            let ptr = x[0].rrOrder;
            let add = q;

            // bt = 3, q = 5
            // for bt == 0
            // 5 - (5-3) = 5 - 2 = 3
            if(q > p[ptr].bt){
                add = q - (q - p[ptr].bt);
            }


            et += add;
            p[ptr].bt -= add;
            pushGantt_PRE(ptr, add);
            checkBt(ptr);
            x.shift();

            console.log('ET :' + et/100 + ' - ' + p[ptr].job + ' - ' + add/100);
            
            if(p[ptr].bt != 0){
                x.push(p[ptr]);
            }
        }
        //console.log('ET: ' + et/100 + ' <= LAST');
        console.log('\n\n\n');
        for(let i = 0; i < p.length; i++){
            console.log(p[i]);
        }

        //return false;

        displayTable();
        displayGanttChart();
    }

    function MLQ(){
        let mlq_ctr = 0;
        let mlq_algo = []
        let mlq_list = [];
        $('.MLQ_INPUT').each(function(){
            mlq_list[mlq_ctr] = []
            let level       = parseInt($(this).find('#mlq_level').val());
            let algo        = parseInt($(this).find('#mlq_algorithm').val());
            let prio        = parseInt($(this).find('#mlq_prio').val());
            let mlq_quantum     = $(this).find('#mlq_quantum').val();

            mlq_algo.push({
                level : level,
                algo : algo,
                prio : prio,
                quantum : mlq_quantum
            });

            mlq_ctr++;
        });

        console.log('Algo');
        console.log(mlq_algo);
        console.log('MLQ_LIST LENGTH = ' + mlq_list.length);
        console.log('MLQ CTR = ' + mlq_ctr);
        for(let i = 0; i < mlq_ctr; i++){
            console.log('MLQ_LIST LENGTH['+ i + '] = ' + mlq_list[i].length);
        }

        for (let i = 0; i < MAX; i++) {
            p[i].linked = false;
        }
        
        mlq_algo.sort(function(a, b){return a.prio - b.prio});

        console.log('Algo Sorted');
        console.log(mlq_algo);

        let myctr = 0;

        function returnAlgo(i){
            switch(i){
                case 1: return 'FCFS';
                case 2: return 'SJF';
                case 3: return 'NPP';
                case 6: return 'RR';
            }
        }

        console.log('MLQ MAX  = ' + MAX);

        while(notDone()){

            checkIdle();

            console.log(' ');
            console.log(' ');


            for (let i = 0; i < MAX; i++) {
                if (p[i].at <= et && p[i].bt != 0 && p[i].linked == false) {
                    console.log('PUSHING: ' + p[i].job + ' to LEVEL: ' + p[i].level);
                    //console.log(p[i]);
                    mlq_list[p[i].level].push(p[i]);
                    p[i].linked = true;
                }
            }

            
            for(let i = 0; i < mlq_ctr; i++){
                if(mlq_list[i].length != 0){
                    //console.log('Algo = ' + mlq_algo[i].algo);
                    for(let z = 0; z < mlq_list[i].length; z++){
                        console.log('LIST: ' + mlq_list[i][z].job + ' - ' + mlq_list[i][z].bt/100 + ' - ' + mlq_list[i][z].level);
                    }

                    switch(mlq_algo[i].algo){
                        case 1: //FCFS

                            mlq_list[i].sort((a, b) => a.at - b.at);

                        break;

                        case 2: //SJF

                            mlq_list[i].sort(function(a, b) {
                                if ((a.bt > b.bt || (a.bt == b.bt && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                                    return 1;
                                }
                                if (!(a.bt > b.bt || (a.bt == b.bt && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                                    return -1;
                                }
                                return 0;
                            });

                        break;

                        case 3: // NPP

                            mlq_list[i].sort(function(a, b) {
                                if ((a.prio > b.prio || (a.prio == b.prio && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                                    return 1;
                                }
                                if (!(a.prio > b.prio || (a.prio == b.prio && (a.at > b.at || (a.at == b.at && a.order > b.order))))) {
                                    return -1;
                                }
                                return 0;
                            });

                        break;
                            
                    }
                    

                    console.log('ET: ' + et/100 + ' - ' + returnAlgo(mlq_algo[i].algo) + ' - ' + 
                    mlq_list[i][0].job);
                    et += p[mlq_list[i][0].order].bt;

                    pushGantt_NPRE(mlq_list[i][0].order);

                    p[mlq_list[i][0].order].bt = 0;

                    checkBt(mlq_list[i][0].order);

                    mlq_list[i].shift();

                    break;
                }
            }
        }

        displayTable();
        displayGanttChart();
    }


    $('#compute').click(function() {
        resetAll();

        $('.CPU_INPUT').each(function() {
            //alert("alert " + i + " " + name);
            let job     = $(this).find('#job').val();
            let at      = $(this).find('#at').val();
            let bt      = $(this).find('#bt').val();
            let prio    = $(this).find('#prio').val();
            let level   = $(this).find('#level').val();

            //alert(job + " " + at + " " + bt + " " + prio + " " + level);

            process.push({
                job: job,
                at: at,
                bt: bt,
                bbt: bt,
                prio: parseInt(prio),
                level: parseInt(level),
                tt: 0,
                wt: 0,
                order: MAX
            });

            //console.log(process[MAX]);
            MAX++;
        });

        console.log("INPUT");
        console.log(process);

        p = process;

        for (let i = 0; i < MAX; i++) {
            p[i].at *= 100;
            p[i].at = Math.round(p[i].at);

            p[i].bt *= 100;
            p[i].bt = Math.round(p[i].bt);

            p[i].bbt = p[i].bt;
        }

        //alert(MAX);
        quantum = $('#quantum').val();

        let algorithm = parseInt($('#algorithm').val());
        allow_modal = true;

        if(all_filled()){
            switch (algorithm) {
            case 1:
                FCFS();
                break;
            case 2:
                SJF();
                break;
            case 3:
                NPP();
                break;
            case 4:
                SRTF();
                break;
            case 5:
                PP();
                break;
            case 6:
                if($('#quantum').val() == ""){
                    alert("Quantum is not defined");
                }else{
                    RR();
                }
                break;
            case 7:
                MLQ();
            break;
            }
        }

        //alert(entries);
    });

    $('.sampleInput').click(function() {
        $('.CPU_INPUT').each(function() {
            $(this).remove();
        });

        

        let x = $(this).val()-1;

        if(x < 4){
            for (let x = 0; x < 6; x++) {
                newRow();
            }
        }else{
            for (let x = 0; x < 7; x++) {
                newRow();
            }
        }

        let quantum_samples = [
            5, 4, 6, 3
        ];

        $('#quantum').val(quantum_samples[x]);

        let samples = [
            [
                ["A", 0, 9, 2],
                ["B", 0, 6, 1],
                ["C", 0, 11, 5],
                ["D", 0, 10, 3],
                ["E", 0, 5, 6],
                ["F", 0, 3, 4]
            ],

            [
                ["A", 0, 8, 3],
                ["B", 0, 9, 2],
                ["C", 1, 10, 5],
                ["D", 2, 3, 1],
                ["E", 3, 5, 4],
                ["F", 10, 4, 3]
            ],

            [
                ["A", 0, 5, 2],
                ["B", 1, 8, 5],
                ["C", 4, 10, 1],
                ["D", 8, 12, 4],
                ["E", 18, 9, 5],
                ["F", 7, 15, 1],
            ],

            [
                ["A", 0, 12, 5],
                ["B", 3, 6, 4],
                ["C", 5, 8, 3],
                ["D", 6, 4, 2],
                ["E", 8, 5, 1],
                ["F", 10, 9, 3],
            ],

            [
                ["A", 0, 11, 5, 1],
                ["B", 6, 5, 4, 0],
                ["C", 6, 16, 3, 1],
                ["D", 14, 13, 2, 0],
                ["E", 18, 1, 1, 0],
                ["F", 26, 10, 3, 1],
                ["G", 35, 8, 1, 0]
            ]
        ];

        let y = 0;

        $('.CPU_INPUT').each(function() {
            //alert("alert " + i + " " + name);
            let echo = $(this).find('#job').val();
            $(this).find('#job')    .val(samples[x][y][0]);
            $(this).find('#at')     .val(samples[x][y][1]);
            $(this).find('#bt')     .val(samples[x][y][2]);
            $(this).find('#prio')  .val(samples[x][y][3]);
            if(x <= 3){
                $(this).find('#level')  .val(0);
            }else{
                $(this).find('#level')  .val(samples[x][y][4]);
            }


            y++;
        });

        let algo = $('#algorithm').val();
        let xxx = [
            [
                [0, 1, 1, 0], // MLQ
                [1, 3, 2, 0]
            ],

            [
                [0, 1, 6, 4], //MLFQ
                [1, 2, 6, 2],
                [2, 3, 3, 0]
            ],

            [
                [0, 1, 2, 0], // MLQ
                [1, 3, 3, 0]
            ],

            [
                [0, 1, 6, 2], //MLFQ
                [1, 2, 6, 3],
                [2, 3, 2, 0]
            ]
        ];

        function initialize_MLQ(i){
            for(let z = 0; z < xxx[i].length; z++){
                //alert(z);
                $("#mlqInput").clone().appendTo('#mlqBody')
                    .addClass('MLQ_INPUT')
                    .removeClass('d-none')
                    .attr('id', 'mlq-' + z);
                
                $('#mlq-' + z).find('#mlq_level').val(xxx[i][z][0])
                
                $('#mlq-' + z).find('#mlq_prio option[value=' + xxx[i][z][1] +']').attr('selected', 'selected');
                
                $('#mlq-' + z).find('#mlq_algorithm option[value=' + xxx[i][z][2] +']').attr('selected', 'selected');
                
                $('#mlq-' + z).find('#mlq_quantum').val(xxx[i][z][3]);
                
                if(xxx[i][z][2] == 6){
                    $('#mlq-' + z).find('#quantumContainer').removeClass('d-none');
                }
            }
        }


        if(x >= 4 && algo >= 7){
            //alert(x + '-' + algo);

            $('.MLQ_INPUT').each(function(){
                $(this).remove();
            });
            
        
            switch(x){
                case 4:
                    switch(parseInt(algo)){
                        case 7:
                            initialize_MLQ(0);
                        break;

                        case 8:
                            initialize_MLQ(1);
                        break;
                    }
                break;

                case 5:
                    switch(algo){
                        case 7:
                            initialize_MLQ(2);
                        break;

                        case 8:
                            initialize_MLQ(3);
                        break;
                    }
                break;
            }
        }

        window.scrollTo(0,document.body.scrollHeight);
        //alert(entries);

    });

  

});
