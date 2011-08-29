/* Case Notes - Start */

function closeCaseNotesWindow(){
  if(Ext.get("caseNotesWindowPanel")){
    Ext.get("caseNotesWindowPanel").destroy();
  }
}

function openCaseNotesWindow(appUid,modalSw){
  if(!appUid) appUid="";

  var startRecord=0;
  var loadSize=10;

  var storeNotes = new Ext.data.JsonStore({
    url : '../caseProxy/getNotesList?appUid='+appUid,
    root: 'notes',
    totalProperty: 'totalCount',
    fields: ['USR_USERNAME','NOTE_DATE','NOTE_CONTENT'],
    baseParams:{
      start:startRecord,
      limit:startRecord+loadSize
    },
    listeners:{
      load:function(){
        if(storeNotes.getCount()<storeNotes.getTotalCount()){
          Ext.getCmp('CASES_MORE_BUTTON').show();
        }else{
          Ext.getCmp('CASES_MORE_BUTTON').hide();
        }
      }
    }
  });
  storeNotes.load();

  var tplNotes = new Ext.XTemplate(
    '<tpl for=".">',
    '<div class="thumb-wrap">',
    '<div class="thumb" >',
    '<span class="x-editable"><b>{USR_USERNAME}</b></span><br>',
    '<span class="x-editable">{NOTE_CONTENT}</span><br>',
    '<span class="x-editable"><small><i>{NOTE_DATE}</i></small><hr /></span>',
    '</div>',
    '</div>',
    '</tpl>',
    '<div class="x-clear"></div>'
    );

  
  var panelNotes = new Ext.Panel({
    id:'notesPanel',

    frame:true,
    autoWidth:true,
    autoHeight:true,
    collapsible:false,    
    items:[ new Ext.DataView({
      store: storeNotes,
      tpl: tplNotes,
      autoWidth:true,
      loadingtext:_('ID_CASE_NOTES_LOADING'),
      autoScroll:true,
      multiSelect: false,
      overClass:'x-view-over',
      itemSelector:'div.thumb-wrap',
      emptyText: _('ID_CASE_NOTES_EMPTY'),


      prepareData: function(data){
        //data.shortName = Ext.util.Format.ellipsis(data.name, 15);
        //data.sizeString = Ext.util.Format.fileSize(data.size);
        //data.dateString = data.lastmod.format("m/d/Y g:i a");
        //console.log(data);
        return data;
      },

      listeners: {
        selectionchange: {
          fn: function(dv,nodes){
            var l = nodes.length;
            var s = l != 1 ? 's' : '';
          //panelNotes.setTitle('Process ('+l+' item'+s+' selected)');
          }
        },
        click: {
          fn: function(dv,nodes,a){
          //console.info("Click");
          //console.log(dv);
          //console.log(a);
          }
        }
      }
    }),{
      xtype:'button',
      id:'CASES_MORE_BUTTON',
      iconCls: '.x-pm-notes-btn',
      hidden:true,
      text:_('ID_CASE_NOTES_MORE'),
      align:'center',
      handler:function() {        
        startRecord=startRecord+loadSize;
        limitRecord=startRecord+loadSize;
        storeNotes.load({
          params:{
            start:0,
            limit:startRecord+loadSize
          }
        });
    }
  }]
  });

var caseNotesWindow;
caseNotesWindow = new Ext.Window({
  title: _('ID_CASES_NOTES'), //Title of the Window
  id: 'caseNotesWindowPanel', //ID of the Window Panel
  width:300, //Width of the Window
  resizable: true, //Resize of the Window, if false - it cannot be resized
  closable: true, //Hide close button of the Window
  modal: modalSw, //When modal:true it make the window modal and mask everything behind it when displayed
  //iconCls: 'ICON_CASES_NOTES',
  autoCreate: true,
  height:400,
  shadow:true,
  minWidth:300,
  minHeight:200,
  proxyDrag: true,
  keys: {
    key: 27,
    fn  : function(){
      caseNotesWindow.hide();
    }
  },
  autoScroll:true,
  items:[panelNotes],
  tools:[
  {
    id:'refresh',
    handler:function() {
      storeNotes.load();
    }
  }
  ],
  bbar:[
  new Ext.ux.StatusBar({
    defaultText : _('ID_NOTES_READY'),
    id : 'notesStatusPanel',
    //defaultIconCls: 'ICON_CASES_NOTES',

    // values to set initially:
    text: _('ID_NOTES_READY'),
    //iconCls: 'ready-icon',
    statusAlign: 'left',

    // any standard Toolbar items:
    items: [{
             text: _('ID_CANCEL'),
             handler: function(){
              caseNotesWindow.close();
             }
            }]
  })
  ],
  tbar:[{
    //xtype:'textfield',
    xtype:'textarea',
    id:'caseNoteText',
    name:'caseNoteText',
    hideLabel: true,
    blankText:_('ID_CASES_NOTES_POST'),
    anchor: '100% -53',
    width:200,
    grow:true,
    selectOnFocus:true,
    maxLenght:150,
    allowBlank:true
  },
  ' ',
  {
    cls: 'x-toolbar1',
    text: _('ID_SUBMIT_NOTE'),
    iconCls: 'x-pm-notes-btn',
    scale: 'large',
    stype:'button',
    iconAlign: 'top',
    handler: function(){
      var noteText = Ext.getCmp('caseNoteText').getValue();
  
      if (noteText == "") {
        return false;
      }

      Ext.getCmp('caseNoteText').focus();
      Ext.getCmp('caseNoteText').reset();
      statusBarMessage( _('ID_CASES_NOTE_POSTING'), true);
      Ext.Ajax.request({
        url : '../caseProxy/postNote' ,
        params : {
          appUid:appUid,
          noteText:noteText
        },
        success: function ( result, request ) {
          var data = Ext.util.JSON.decode(result.responseText);
          if(data.success=="success"){
            statusBarMessage( _('ID_CASES_NOTE_POST_SUCCESS'), false,true);
            storeNotes.load();
          }else{
            statusBarMessage( _('ID_CASES_NOTE_POST_ERROR'), false,false);
            Ext.MessageBox.alert(_('ID_CASES_NOTE_POST_ERROR'), data.message);

          }
        },
        failure: function ( result, request) {
          statusBarMessage( _('ID_CASES_NOTE_POST_FAILED'), false,false);
          Ext.MessageBox.alert(_('ID_CASES_NOTE_POST_FAILED'), result.responseText);
        }
      });
    }
  }],
  listeners:{
    show:function() {
      this.loadMask = new Ext.LoadMask(this.body, {
        msg:_('ID_LOADING')
      });
    },
    close:function(){
      //console.log(Ext.get("caseNotes"));
      if(Ext.get("caseNotes")){
        Ext.getCmp("caseNotes").toggle(false);
      //Ext.getCmp('caseNotes').show();
      }
    }
  }
});
caseNotesWindow.show();
}

function statusBarMessage( msg, isLoading, success ) {
  // console.log("Status Bar needed");
  // console.log(msg);
  var statusBar = Ext.getCmp('notesStatusPanel');
  if( !statusBar ) return;
  // console.log("Status bar acceced: "+msg);
  if( isLoading ) {
    statusBar.showBusy(msg);
  }
  else {
    //statusBar.setStatus("Done.");
    statusBar.clearStatus();
    if( success ) {
      statusBar.setStatus({
        text: '' + msg,
        //iconCls: 'success',
        clear: true
      });
    } else {
      statusBar.setStatus({
        text: 'Error: ' + msg,
        //iconCls: 'error',
        clear: true
      });
    }
  }
}


/* Case Notes - End */
/* Case Summary - Start */
Ext.util.Format.capitalize = (function(){
  var re = /(^|[^\w])([a-z])/g,
  fn = function(m, a, b) {
    return a + b.toUpperCase();
  };
  return function(v) {
    return v.toLowerCase().replace(re, fn);
  }
})();

var openSummaryWindow = function(applicationUID, delegation) {
  var summaryForm = new Ext.FormPanel({
    title: Ext.util.Format.capitalize(_('ID_GENERATE_INFO')),
    frame : true,
    height: 440,
    labelWidth: 150,
    items : [{
      xtype: 'displayfield',
      name: 'TITLE1',
      labelStyle: 'font-weight:bold;'
    },
    {
      xtype: 'displayfield',
      name: 'PRO_TITLE'
    },
    {
      xtype: 'displayfield',
      name: 'TITLE'
    },
    {
      xtype: 'displayfield',
      name: 'APP_NUMBER'
    },
    {
      xtype: 'displayfield',
      name: 'STATUS'
    },
    {
      xtype: 'displayfield',
      name: 'APP_UID'
    },
    {
      xtype: 'displayfield',
      name: 'CREATOR'
    },
    {
      xtype: 'displayfield',
      name: 'CREATE_DATE'
    },
    {
      xtype: 'displayfield',
      name: 'UPDATE_DATE'
    },
    {
      xtype: 'displayfield',
      name: 'TITLE2',
      labelStyle: 'font-weight:bold;'
    },
    {
      xtype: 'displayfield',
      name: 'TAS_TITLE'
    },
    {
      xtype: 'displayfield',
      name: 'CURRENT_USER'
    },
    {
      xtype: 'displayfield',
      name: 'DEL_DELEGATE_DATE'
    },
    {
      xtype: 'displayfield',
      name: 'DEL_INIT_DATE'
    },
    {
      xtype: 'displayfield',
      name: 'DEL_TASK_DUE_DATE'
    },
    {
      xtype: 'displayfield',
      name: 'DEL_FINISH_DATE'
    }],
  });

  var summaryWindow = new Ext.Window({
    title: _('ID_SUMMARY'),
    id: 'summaryWindow',
    width: 750,
    height: 500,
    minWidth: 750,
    minHeight: 500,
    left: 0,
    top: 0,
    resizable: false,
    closable: true,
    modal: true,
    autoScroll:true,
    shadow: true,
    bodyBorder: false,
    keys: {
      key: 27,
      fn: function() {
        summaryWindow.close();
      }
    },
    listeners: {
      show: function() {
        this.loadMask = new Ext.LoadMask(this.body, {
          msg: _('ID_LOADING')
        });
        this.loadMask.show();
        Ext.Ajax.request({
          url : '../cases/summaryAjax',
          params : {
            action : 'getDataSummary',
            APP_UID: applicationUID,
            DEL_INDEX: delegation
          },
          success: function (result, request) {
            var response = Ext.util.JSON.decode(result.responseText);
            var tabs = [];
            if (response.values.DYN_UID != '') {
              tabs.push({title: Ext.util.Format.capitalize(_('ID_MORE_INFORMATION')), bodyCfg: {
                tag: 'iframe',
                id: 'summaryIFrame',
                src: '../cases/summary?APP_UID=' + applicationUID + '&DEL_INDEX=' + delegation + '&DYN_UID=' + response.values.DYN_UID,
                style: {border: '0px none', height: '440px'},
                onload: ''
              }});
            }
            for (var fieldName in response.labels) {
              var field = summaryForm.getForm().findField(fieldName);
              if (field) {
                field.fieldLabel = response.labels[fieldName];
              }
            }
            summaryForm.getForm().setValues(response.values);
            tabs.push(summaryForm);
            var summaryTabs = new Ext.TabPanel({
              activeTab: 0,
              items: tabs
            });
            summaryWindow.add(summaryTabs);
            summaryWindow.doLayout();
            summaryWindow.loadMask.hide();
          },
          failure: function (result, request) {
            Ext.MessageBox.alert('Failed', result.responseText);
          }
        });
      },
      close: function() {
        var summaryIFrame = document.getElementById('summaryIFrame');
        delete(summaryIFrame);
      }
    }
  });
  summaryWindow.show();
};
/* Case Summary - End*/
