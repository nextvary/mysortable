/**
 * Created by vary on 2018/4/19.
 */
(function(win,doc,undefined){
    var Mysortable=function (type,id,clazz) {
        this.type=type||1;
        this.author='vary';
        this.id=id||'#items';
        this.clazz=clazz||'.options';
        this.init();
        console.log(this);
    };

    Mysortable.prototype={
        constructor:Mysortable,
        init:function () {
            if($(this.clazz).length>0){
                this.obj=$(this.clazz);
                this.el=doc.getElementsByClassName(this.clazz.substr(1,this.clazz.length-1))[0];

            }else if($(this.id).length>0){
                this.obj=$(this.id);//操作的items
                this.el=doc.getElementById(this.id.substr(1,this.id.length-1));

            }else{
                return '请传递参数';
            }
            this.obj.append('<input type="text" class="option" name="options" style="display:none;">');
            this.obj.append('<input type="text" class="answer form-control"   readonly="readonly" name="answers" style="position: absolute;z-index: 99;">');
            this.obj.css({"position":"relative"});



            this.obj.append('<input type="button" class="add btn btn-primary" style="position: absolute;" value="新增选项">');
            this.addOptions();

            this.obj.find('.add').bind('click',{sortable:this},function (e) {
                e.data.sortable.addOptions(1);
            });

            this.create(this);

        },
        addOptions:function (num,id,desc) {
            num=num||0;
            id=id||0;
            desc=desc||'选项';
            var html='';
            for (var i=0;i<num;i++){
                html+='<li data-id="'+id+'" class="list-group-item"><span class="sort"></span><span class="desc">'+desc+(i+1)+'</span>' +
                    '<span  class="edit">' +
                    '<i class="choose" title="选为答案">√</i> ' +
                    '<i class="remove" title="取消选中" >x</i>' +
                    '<i class="del" title="删除选项">删除</i> ' +
                    '</span>' +
                    ' </li>';
            }
            this.obj.find('.add').before(html);
            this.store();
            this.bindEdit();

        },
        store:function () {
            var sortable=this;
            var need=[];
            var answers=[];
            this.obj.find('li').each(function (index,el) {
                var desc=$(el).find('.desc').text();
                var sort=String.fromCharCode((65+index));
                $(el).find('.sort').html(sort);
                need.push({"option_id":$(el).attr('data-id'),"sort":sort,'desc':desc});
                if($(el).hasClass('active')){
                    answers.push(sort);
                }

            });
            if(need.length!=0){
                this.obj.find('.option').val(JSON.stringify(need));
            }else{
                this.obj.find('.option').val('');

            }
            console.log(this.obj.find('.option').val());
            if(answers.length!=0){
                this.obj.find('.answer').val(JSON.stringify(answers));
            }else{
                this.obj.find('.answer').val('');
            }

        },
        create :function (obj) {
            win.Sortable.create(this.el,{animation: 150,
                onEnd: function(evt){
                    obj.store();
                },
                filter: 'i',
                onFilter: function (evt) {
                    var classname=$(evt)[0].target.className;
                    if(classname=='choose'){
                        if(obj.type==1 ){
                            //多选时候屏蔽 active
                            $(evt.item).siblings('li').removeClass('active');
                        }
                        $(evt.item).addClass('active');

                        var answer=$(evt.item).parent('ul').find('.answer');
                        answer.removeClass('error');
                        $('.answer_error').hide();
                    }else if(classname=='remove'){
                        $(evt.item).removeClass('active');
                    }else if(classname=='del'){
                        $(evt.item).remove();
                    }

                    obj.store();
                }
            })
        },
        bindEdit:function () {
            this.obj.find('li').unbind('dblclick');
            this.obj.find('li').bind('dblclick',{sortable:this},function (ev) {
                $(this).find('input').remove();
                var desc=$(this).find('.desc');
                if(desc.text()!==''){
                    desc.hide();
                    desc.after("<input type='text' value=''  >");
                    $(this).find('input').bind('blur',{"input":$(this).find('input'),'this':ev.data.sortable},ev.data.sortable.editblur);
                    $(this).find('input').focus().val(desc.text()).select();
                    ev.data.sortable.store();
                }
            });

        },
        editblur:function (obj) {
            mysortable=obj.data.this;
            obj=obj.data.input;
            var desc=obj.val();
            if(desc!=''){
                obj.prev().show().html(desc);
            }else{
                obj.prev().show();
            }
            mysortable.obj.find('li input').remove();
            mysortable.store()
        }

    };
    win.Mysortable = Mysortable;
})(window,document);