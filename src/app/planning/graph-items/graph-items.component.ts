import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PlanningService } from '../planning.service';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
// import { map } from "rxjs/operators";

import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServiceService } from 'src/app/service.service';
import { Subscription } from 'rxjs';

import * as go from 'gojs';
import * as Jquery from 'jquery';
import { ZoomSlider } from 'src/app/zoomSlider';

declare var $: any;
@Component({
  selector: 'app-graph-items',
  templateUrl: './graph-items.component.html',
  styleUrls: ['./graph-items.component.css'],
})
export class GraphItemsComponent implements OnInit, AfterViewInit {
  myFormGroup: FormGroup;
  // formTemplate: any = form_template;
  //declation for go js codes
  id: any;
  myDiagram: any;
  selectedTab: any;
  public showDiagram: boolean = false;
  tabsandElements: any = [];
  data: any[];
  currentModel: any[];
  dropDownList: any[];
  childTabElementIds: any[];
  childOptionsList: any[];
  clickedPort: number;

  messageReceived: any;
  private subscriptionName: Subscription;
  private EditsubscriptionName: Subscription;
  listItemMsgReceived: any;
  //end declation for go js codes

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private _location: Location,
    private fb: FormBuilder,
    private http: HttpClient,
    private appService: ServiceService
  ) {
    this.subscriptionName = this.appService.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      this.messageReceived = message.text;
      this.pageName = this.messageReceived.pageName;
      this.pageId = this.messageReceived.pageID;

      //edit item
    });
    this.EditsubscriptionName = this.appService
      .getUpdate()
      .subscribe((message) => {
        //message contains the data sent from service
        this.listItemMsgReceived = message.text;
        this.pageType = this.listItemMsgReceived.pageType;
        this.elementID = this.listItemMsgReceived.elementID;
        console.log(
          'edit graphitem input:' + this.pageType + '-' + this.elementID
        );
        // console.log(this.pageType, this.elementID);
        // this.GetallElementsByID(this.elementID, this.pageType);
        let data;
        let actionLink = '';

        if (this.pageType == 'Shelf') {
          data = { ShelfID: this.elementID };
          actionLink = environment.gojsUrl + '/viewShelf';
        }
        if (this.pageType == 'Device') {
          data = { START_NEID: this.elementID };
          actionLink = environment.gojsUrl + '/GetNEElevationLinkView';
        }
        if (this.pageType == 'Card') {
          data = { cardID: this.elementID };
          actionLink = environment.baseUrl + '/viewCard';
        }
        if (this.pageType == 'Link') {
          data = { linkID: this.elementID };
          actionLink = environment.gojsUrl + '/getLinkView';
        }
        if (actionLink == '') this.ngAfterViewResonse('');
        else {
          this.onClickSubmit(data, actionLink);
        }
      });
  }

  pageType;
  elementID;
  pageId;
  pageName;
  formElements;
  submitAction;
  deviceDtls;
  ngOnInit() {
    this.myFormGroup = new FormGroup({});
    this.showDiagram = true;
  }

  //go js code

  name = 'GoJS';

  @ViewChild('myDiagramDiv')
  element: ElementRef;

  ngAfterViewInit() {
    console.log('ngAfterViewInit graph ');

    // $("#zoomSliderIn").click(function(){
    //   alert("The paragraph was clicked."+this.myDiagram.initialScale);
    // });

    // jQuery(this.el.nativeElement).find('#zoomSliderIn').on('click', () => {
    //   console.log("scale value="+this.myDiagram.initialScale);
    //   });

    this.showDiagram = true;

    var $ = go.GraphObject.make;

    this.myDiagram = $(go.Diagram, 'myDiagramDiv', {
      initialScale: 0.5,
      initialContentAlignment: go.Spot.TopCenter,
      'undoManager.isEnabled': true,
    });

    var setZoomSlider = new ZoomSlider(this.myDiagram, {
      alignment: go.Spot.TopLeft,
      alignmentFocus: go.Spot.TopLeft,
      size: 180,
      buttonSize: 35,
      orientation: 'vertical',
    });

    function getContMenu() {
      // This is the actual HTML context menu:
      // var cxElement = document.getElementById("contextMenu");

      // Since we have only one main element, we don't have to declare a hide method,
      // we can set mainElement and GoJS will hide it automatically
      var myContextMenu = $(go.HTMLInfo, {
        show: showContextMenu,
        // mainElement: cxElement
      });

      return myContextMenu;
    }

    function printme() {
      console.log('printed');
    }

    function showContextMenu(obj, diagram, tool) {
      console.log('obj=' + obj.part.data.fillcolor);
      // console.log('objcont='+obj.fillcolor);
      // Show only the relevant buttons given the current state.
      var cmd = diagram.commandHandler;

      //   if(obj.key == 'Beta'){
      //   var cxElement = document.getElementById("contextMenu");
      //   cxElement.innerHTML = obj.context;
      // }else{
      var cxElement = document.getElementById('contextMenu');
      cxElement.innerHTML = obj.part.data.context_menu;

      cxElement.style.display = 'block';
      // // we don't bother overriding positionContextMenu, we just do it here:
      var mousePt = diagram.lastInput.viewPoint;
      cxElement.style.left = mousePt.x + 'px';
      cxElement.style.top = mousePt.y + 'px';
    }

    // define a simple Node template
    this.myDiagram.nodeTemplate = $(
      go.Node,
      'Auto',
      { avoidable: false },
      { deletable: false },
      $(
        go.Panel,
        'Auto',
        new go.Binding('type', 'case', function (c) {
          return c <= 2 ? go.Panel.Horizontal : go.Panel.Vertical;
        }),
        new go.Binding('isOpposite', 'case', function (c) {
          return c === 1 || c === 3;
        }),
        {
          fromLinkable: true,
          toLinkable: true,
          // fromSpot: go.Spot.TopBottomSides,
          // toSpot: go.Spot.TopBottomSides,
           fromSpot: go.Spot.RightSide,  // coming out from right side
            toSpot: go.Spot.LeftSide 
        },
        $(
          go.TextBlock,
          {
            //width:50,
            alignment: go.Spot.Right,
            margin: 1,
            //wrap:go.TextBlock.WrapFit
          },
          
          //font: "Bold 18pt Sans-Serif",
          new go.Binding('font', 'font'),
          new go.Binding('width', 'width'),
          new go.Binding('height', 'height'),
          new go.Binding('angle', 'angle'),

          new go.Binding('visible', 'showtxt', function (showtxt) {
            return showtxt !== 0;
          }),
          new go.Binding('text', 'txt')
        ),
        //$(go.Shape, "RoundedRectangle", { fill: "black", strokeWidth: 0 }),
        // $(go.Shape, "Circle", { desiredSize: new go.Size(8, 8), margin: 1, fill: "white" })
        $(
          go.Picture,

          new go.Binding('source', 'img'),
          { width: 20, height: 25, margin: 0 },
          new go.Binding('visible', 'showpic', function (showpic) {
            return showpic !== 0;
          })
        )
      )
    );

    // var zoomSlider = new ZoomSlider(this.myDiagram,
    //   {
    //     alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft,
    //     size: 150, buttonSize: 30, orientation: 'vertical'
    //   });

    this.myDiagram.groupTemplate = $(
      go.Group,
      'Auto',
      new go.Binding('position', 'loc', go.Point.parse),

      { movable: false },
      { avoidable: false },
      { deletable: false },
      new go.Binding('layout', 'lay', function (lay) {
        if (lay.horizontal) {
          return $(go.GridLayout, {
            alignment: go.GridLayout.Position,
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(0, 0),
            wrappingWidth: Infinity,
            wrappingColumn: lay.wrapCol,
          });
        } else {
          return $(go.GridLayout, {
            alignment: go.GridLayout.Position,
            cellSize: new go.Size(0, 0),
            spacing: new go.Size(0, 1),
            wrappingColumn: lay.wrapCol,
          });
        }
      }),

      $(
        go.Shape,
        new go.Binding('figure', 'fig'),
        new go.Binding('fill', 'fillcolor'),
        new go.Binding('stroke', 'stroke'),
        new go.Binding('strokeWidth', 'strokeWidth'),
        new go.Binding('desiredSize', 'size', go.Size.parse)
      ),
      $(
        go.Placeholder,
        { padding: 2 },

        new go.Binding('alignment', 'align')
      ),
      $(
        go.TextBlock,
        { margin: 3 },
        {
          //width:50,
          alignment: go.Spot.Top,
          wrap:go.TextBlock.WrapFit
        },
        // font: "Bold 8pt Sans-Serif",
        new go.Binding('width', 'txtwidth'),
        new go.Binding('font', 'font'),
        new go.Binding('visible', 'showheader', function (showtxt) {
          return showtxt !== 0;
        }),
        new go.Binding('text', 'key')
      ),

      new go.Binding('contextMenu', 'clicktype', function (cnt) {
        if (cnt == 0) {
          return {
            contextMenu: getContMenu(),
            click: (e, node) => e.diagram.commandHandler.showContextMenu(node),
          };
        }
      })
      //    { contextMenu: getContMenu(),
      //       click: (e, node) => e.diagram.commandHandler.showContextMenu(node)
      //    }

      /*  {
          contextMenu:
            $(go.Adornment, "Vertical",
              new go.Binding("itemArray", "commands"),
              {
                itemTemplate:
                  $("ContextMenuButton",
                    $(go.TextBlock, new go.Binding("text")),
                    {
                      click: function (e, button) {
                        var cmd = button.data;
                        var nodedata = button.part.adornedPart.data;
                        console.log("On " + cmd.text + ": " + cmd.action);
                        addCard();
                      }
                    }
                  )
              }
            )
        }*/
    );
    function addCard() {
      console.log('add card API call');
    }
    function addSlot() {
      console.log('add slot');
    }

    function parseParent(objectName, parentJSON, index) {
      var parsedJSON = JSON.parse(JSON.stringify(parentJSON));
      if (objectName == 'Slot') {
        var parentShelf = parsedJSON['Shelf'];
        var parentObjectID = parentShelf.shelfID;
        var parentObjectNamee = parentShelf.shelfName;
        console.log('parsed val=' + parentObjectID + '  ' + parentObjectNamee);

        if (index == 0) {
          Jquery('.form-control').filter('[data-val="Shelf0"]').empty();
          Jquery('.form-control')
            .filter('[data-val="Shelf0"]')
            .append(
              '<option value="' +
                parentObjectID +
                '">' +
                parentObjectNamee +
                '</option>'
            );
          Jquery('.form-control')
            .filter('[data-val="Shelf0"]')
            .val(parentObjectID)
            .trigger('change');
        } else if (index == 1) {
          Jquery('.form-control').filter('[data-val="Shelf1"]').empty();
          Jquery('.form-control')
            .filter('[data-val="Shelf1"]')
            .append(
              '<option value="' +
                parentObjectID +
                '">' +
                parentObjectNamee +
                '</option>'
            );
          Jquery('.form-control')
            .filter('[data-val="Shelf1"]')
            .val(parentObjectID)
            .trigger('change');
        }

        // Jquery('.form-control')..filter('[data-val="Shelf0"]').change(function(){
        //  var data= $(this).val();
        //  alert(data);
        //});
        // Jquery('.form-control').filter('[data-val="Shelf0"]').trigger('change');
      }
    }

    //when link between ports are drawn
    this.myDiagram.addDiagramListener('LinkDrawn', (e) => {
      console.log('clickedport' + this.clickedPort);
      var part = e.subject.part;
      console.log(JSON.stringify(part.data));
      var fromPort = part.data.from;
      var toPort = part.data.to;
      var tool = this.myDiagram.toolManager.linkingTool;
      var direction = tool.direction;
      var link = e.subject;
      var fromIndex = link.fromNode.data.index;
      var toIndex = link.toNode.data.index;
      console.log('link key' + link.fromNode.data.index);
      //console.log('link key'+link.toNode.clicktype);
      //tool.archetypeLinkData = {'fromPort':2000,'toPort':1000,'from':100,'to':3000,'direction':'rtl'};
      alert('direc' + direction);
      alert(
        'Link Dran from' + fromPort + ' to=' + toPort + 'direc=' + direction
      );

      this.http
        .get(
          environment.apikey +
            '/getObjectDetaills/' +
            fromPort.split('port')[1] +
            '/Port'
        )
        .map((res: Response) => res.json())
        .subscribe((data: any) => {
          if (data.status == 'success')
            //parseParent(part.data.objectname, data.PARENT_JSON, part.data.index);
            console.log('parentport');

          console.log('parent json=' + JSON.stringify(data.PARENT_JSON));
          console.log('child json=' + JSON.stringify(data.CHILD_JSON));

          var parentNE = data.PARENT_JSON.parent_ne;
          var parentShelf = data.PARENT_JSON.parent_shelf;
          var parentCard = data.PARENT_JSON.parent_card;

          if (parentShelf != null && fromIndex == 0) {
            Jquery('.form-control')
              .filter('[data-val="Shelf0"]')
              .append(
                '<option value="' +
                  parentShelf +
                  '">Shelf ' +
                  parentShelf +
                  '</option>'
              );
            Jquery('.form-control')
              .filter('[data-val="Shelf0"]')
              .val(parentShelf)
              .change();

            Jquery('.form-control')
              .filter('[data-val="Port0"]')
              .append(
                '<option value="' + fromPort + '">' + fromPort + '</option>'
              );
            Jquery('.form-control')
              .filter('[data-val="Port0"]')
              .val(fromPort)
              .change();
          } else if (parentShelf != null && fromIndex == 1) {
            Jquery('.form-control')
              .filter('[data-val="Shelf1"]')
              .append(
                '<option value="' +
                  parentShelf +
                  '">Shelf ' +
                  parentShelf +
                  '</option>'
              );
            Jquery('.form-control')
              .filter('[data-val="Shelf1"]')
              .val(parentShelf)
              .change();

            Jquery('.form-control')
              .filter('[data-val="Port1"]')
              .append(
                '<option value="' + fromPort + '">' + fromPort + '</option>'
              );
            Jquery('.form-control')
              .filter('[data-val="Port1"]')
              .val(fromPort)
              .change();
          }

          //  if(index ==0){
          //   Jquery('.form-control').filter('[data-val="Shelf0"]').empty();
          //   Jquery('.form-control').filter('[data-val="Shelf0"]').append('<option value="'+parentObjectID+'">'+parentObjectNamee+'</option>');
          //  Jquery('.form-control').filter('[data-val="Shelf0"]').val(parentObjectID).trigger('change');
          //  }else if(index ==1){
          //   Jquery('.form-control').filter('[data-val="Shelf1"]').empty();
          //   Jquery('.form-control').filter('[data-val="Shelf1"]').append('<option value="'+parentObjectID+'">'+parentObjectNamee+'</option>');
          //   Jquery('.form-control').filter('[data-val="Shelf1"]').val(parentObjectID).trigger('change');
          //  }
        });

      this.http
        .get(
          environment.apikey +
            '/getObjectDetaills/' +
            toPort.split('port')[1] +
            '/Port'
        )
        .map((res: Response) => res.json())
        .subscribe((data: any) => {
          if (data.status == 'success')
            console.log('parent json=' + JSON.stringify(data.PARENT_JSON));
          console.log('child json=' + JSON.stringify(data.CHILD_JSON));

          var parentNE = data.PARENT_JSON.parent_ne;
          var portParentShelf = data.PARENT_JSON.parent_shelf;
          var parentCard = data.PARENT_JSON.parent_card;

          if (portParentShelf != null && toIndex == 0) {
            Jquery('.form-control')
              .filter('[data-val="Shelf0"]')
              .append(
                '<option value="' +
                  portParentShelf +
                  '">Shelf ' +
                  portParentShelf +
                  '</option>'
              );
            Jquery('.form-control')
              .filter('[data-val="Shelf0"]')
              .val(portParentShelf)
              .change();

            Jquery('.form-control')
              .filter('[data-val="Port0"]')
              .append('<option value="' + toPort + '">' + toPort + '</option>');
            Jquery('.form-control')
              .filter('[data-val="Port0"]')
              .val(toPort)
              .change();
          } else if (portParentShelf != null && toIndex == 1) {
            Jquery('.form-control')
              .filter('[data-val="Shelf1"]')
              .append(
                '<option value="' +
                  portParentShelf +
                  '">Shelf ' +
                  portParentShelf +
                  '</option>'
              );
            Jquery('.form-control')
              .filter('[data-val="Shelf1"]')
              .val(portParentShelf)
              .change();

            Jquery('.form-control')
              .filter('[data-val="Port1"]')
              .append('<option value="' + toPort + '">' + toPort + '</option>');
            Jquery('.form-control')
              .filter('[data-val="Port1"]')
              .val(toPort)
              .change();
          }
        });
    });

    this.myDiagram.addDiagramListener('ObjectSingleClicked', (e) => {
      var part = e.subject.part;
      this.clickedPort = part.data.key;
      console.log(JSON.stringify(part.data.key));
      console.log(JSON.stringify('index=' + part.data.index));
      console.log(
        JSON.stringify(part.data.objectid + '/' + part.data.objectname)
      );
      ///console.log(JSON.stringify(part.data.clicktype));
      //if(part.data.clicktype ==1){
      // Jquery('.form-control[data-val="Shelf0"]').val('LR-V-F');
      if (part.data.index == 0) {
        Jquery('.form-control')
          .filter('[data-val="' + part.data.objectname + '0"]')
          .append(
            '<option value="' +
              part.data.objectid +
              '">' +
              part.data.objectname +
              part.data.objectid +
              '</option>'
          );
        Jquery('.form-control')
          .filter('[data-val="' + part.data.objectname + '0"]')
          .val(part.data.objectid)
          .change();
      } else if (part.data.index == 1) {
        Jquery('.form-control')
          .filter('[data-val="' + part.data.objectname + '1"]')
          .append(
            '<option value="' +
              part.data.objectid +
              '">' +
              part.data.objectname +
              part.data.objectid +
              '</option>'
          );
        Jquery('.form-control')
          .filter('[data-val="' + part.data.objectname + '1"]')
          .val(part.data.objectid)
          .change();
      }

      this.http
        .get(
          environment.apikey +
            '/getObjectDetaills/' +
            part.data.objectid +
            '/' +
            part.data.objectname
        )
        .map((res: Response) => res.json())
        .subscribe((data: any) => {
          if (data.status == 'success')
            parseParent(
              part.data.objectname,
              data.PARENT_JSON,
              part.data.index
            );
          console.log('parent json=' + JSON.stringify(data.PARENT_JSON));
          console.log('child json=' + JSON.stringify(data.CHILD_JSON));
        });

      var cxElement = document.getElementById('contextMenu');
      cxElement.innerHTML = part.data.context_menu;

      cxElement.style.display = 'block';
      // }
    });

    this.myDiagram.linkTemplate = $(
      go.Link, // defined below
      {
        routing: go.Link.AvoidsNodes,
        corner: 4,
        curve: go.Link.JumpGap,
        reshapable: true,
        resegmentable: true,
        relinkableFrom: true,
        relinkableTo: true,
      },
      new go.Binding('points').makeTwoWay(),
      $(go.Shape, { stroke: '#2F4F4F', strokeWidth: 2 })
    );

    // var setZoomSlider = new ZoomSlider(this.myDiagram, {
    //   alignment: new go.Point(120,5) , alignmentFocus: new go.Point(120,5),
    //   size: 150, buttonSize: 30, orientation: 'vertical'
    // });
  }

  loadView(viewUrl, viewBody) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    if (viewUrl !== '' && viewUrl !== null && viewUrl !== undefined) {
      this.http
        .post(viewUrl, JSON.stringify(viewBody), { headers: headers })
        .map((res: Response) => res.json())
        .subscribe(
          (res: any) => {
            this.ngAfterViewResonse(res);

            this.showDiagram = true;
          },
          (error) => {
            console.log(error.json());
            this.ngAfterViewResonse('');
          }
        );
    }
    function itemClick(event) {
      alert('item clicked');
    }
  }
  itemClick(pageID) {
    alert('item clicked');
    window.location.href = 'http://localhost:4200/#/planner/' + pageID;
  }
  ngAfterViewResonse(resArray) {
    console.log('ngAfterViewResonse');

    //create the model data that will be represented by Nodes and Links
    // this.myDiagram.model = $(go.GraphLinksModel,
    //   {
    //     nodeDataArray: resArray
    //   }
    // );

    this.myDiagram.model = go.Model.fromJson({
      class: 'go.GraphLinksModel',
      copiesArrays: true,
      copiesArrayObjects: true,
      linkFromPortIdProperty: 'fromPort',
      linkToPortIdProperty: 'toPort',
      nodeDataArray: resArray[0],
      linkDataArray: resArray[1],
    });

    //this.myDiagram.div = null;
  }

  toggleNavMenu() {
    $('#sidebar').toggleClass('active');
  }

  loadMenu() {
    this.tabsandElements = [];
    this.http
      .get(environment.apikey + '/getTabsAndElements/' + this.id)
      .map((res: Response) => res.json())
      .subscribe((data: any) => {
        if (data.status == 'success') this.tabsandElements = data.tabs_list;
        console.log(this.tabsandElements);
        this.selectedTab = this.tabsandElements[0].tab_id;
        console.log('selected tab=' + this.selectedTab);
        // Jquery('#myDiagramDiv').empty();
        // document.getElementById('myDiagramDiv').innerHTML = "";

        this.myDiagram.model = go.Model.fromJson('{}');
      });
  }

  toggleTab(tabId, data) {
    console.log('toggle tab=' + tabId);
    this.selectedTab = tabId;

    this.saveTabDataInLocalStorage(this.selectedTab, data);

    console.log('tform data=' + JSON.stringify(data));

    this.currentModel = data;

    //    console.log('cur model='+JSON.stringify(this.currentModel));
    $('#tab_' + tabId)
      .parent()
      .find('li')
      .removeClass('active');
    $('#tab_' + tabId).addClass('active');
  }

  saveTabDataInLocalStorage(tabID, data) {
    // angular.forEach(this.tabsandElements, function(todo){
    //   if (!todo.done)
    //     $scope.todos.push(todo);
    // });

    localStorage.setItem('data', data);
  }

  onChangeDropdown(event) {}

  onClickSubmit(data, actionLink) {
    console.log(data);
    console.log('action link--' + actionLink);

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    this.http
      .post(actionLink, data, { headers: headers })
      // .map((res: Response) => res.json())
      .subscribe(
        (res: any) => {
          console.log(JSON.stringify(res));
          console.log('generated id=' + res.id);
          console.log('view url=' + res.view_url);
          console.log('view body=' + JSON.stringify(res.view_body));
          this.loadView(res.view_url, res.view_body);

          if (res.message !== undefined) {
            alert(res.message);
          }

          this.ngAfterViewResonse(res);
        },
        (error: any) => {
          console.log(error);
          this.ngAfterViewResonse('');
        }
      );
  }
}
