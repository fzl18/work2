import React, { Component } from 'react';
import { Modal, Button, Icon } from 'antd';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import './style/sortList.less';

const SortableItem = SortableElement(({value}) =>
    <div className="sortgrid-item">
        <div className="sortitem">
            {value.name}
        </div>
    </div>
);

const SortableList = SortableContainer(({items}) => {
    return (
        <div className='degreesort'>
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} value={value} />
            ))}
        </div>
    );
});

class SortList extends Component {

    state = {
        visible: false,
        sortUrl:this.props.sortUrl || '',
        degreeDataList: [],
        optionDataList: [],
        items: [],
        data: this.props.data || {},
        title: this.props.title || {}
    };

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex),
        });
    };

    show = (ref) => {
        this.setState({
            visible: true,
            items: ref
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    sendDegreeSort = (items) => {
        this.setState({ confirmLoading: true });
        const params = this.state.data;
        const options = {
            url: `${this.state.sortUrl}?${items}`,
            data: {
                ...params
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    visible: false,
                    confirmLoading: false
                });
                Modal.success({title: "排序成功"});
                this.props.reload();
            }),
            errorResult: (() => {
                   this.setState({confirmLoading: false});
                }
            ),
            failResult: (() => {
                    this.setState({confirmLoading: false});
                }
            ),
        };
        
        AjaxRequest.sendRequest(options);
    };

    saveSort = () =>{
        const items = this.state.items;
        let str='';
        items.map(function(val,index){
            str += `params[${val.key}]=${index + 1}&`;
        })
        this.sendDegreeSort(str);
    }

    render() {
        const { visible, confirmLoading, title } = this.state;
        return (
            <Modal
                title={title}
                visible={visible}
                onCancel={this.hide}
                onOk={this.saveSort}
                className="create-modal sort-modal"
                wrapClassName="vertical-center-modal"
                width="500px"
                confirmLoading={confirmLoading}
            >
                <div>
                    <SortableList items={this.state.items} axis="xy" helperClass="sortHelper" onSortEnd={this.onSortEnd} />
                </div>
                <div>

                </div>
            </Modal>
        );
    }
}

export default SortList;
