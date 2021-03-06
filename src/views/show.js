import {getTopic, setError} from '../redux/actions'
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Divider from 'material-ui/Divider';
import {Card, CardTitle, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import {Link} from 'react-router-dom'
import timeago from 'timeago.js';
import marked from 'marked'
import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import Title from '../components/Title'

const timeagoFormat = time => timeago().format(time, 'zh_CN')

const SubBox = styled.div`
  padding-top: 10px;
`
const ContentBox = styled.div`
  word-break: break-all;
`
const ItemBox = styled.div`
  font-size: 14px;
`
const Flex = styled.div`
  display: flex;
  align-items: center;
`
const ReplyAuthor = styled.div`
  flex: 1;
  margin-left: 16px;
`
const iconStyle = {
  transform: 'scale(0.68) translateY(-1px)'
}
const LikeCount = styled.span`
  width: 16px;
  overflow: hidden;
`

class Show extends Component {

  state = {
    topic: {}
  }

  componentWillMount() {
    let { match, actions } = this.props
    let { id } = match.params
    if (/^[a-z\d]{24}$/i.test(id)) {
      actions.getTopic(id)
        .then(topic => {
          this.setState({
            topic
          })
        })
        .catch(error => {
          this.props.history.replace('/404')
        })
    } else {
      this.props.history.replace('/404')
    }
  }

  render() {
    return this.state.topic.id ? (
      <div>
        <Title>{this.state.topic.title}</Title>
        <Card>
          <CardTitle title={this.state.topic.title} subtitle={
            <SubBox>
              <Link to={`/user/${this.state.topic.author.loginname}`}>{this.state.topic.author.loginname}</Link> {timeagoFormat(this.state.topic.create_at)} 发表 | {this.state.topic.visit_count}次浏览
            </SubBox>
          } />
          <CardText>
            <ContentBox dangerouslySetInnerHTML={{__html: marked(this.state.topic.content)}}></ContentBox>
          </CardText>
        </Card>
        <br/>
        <Card>
          <CardHeader
            title={`${this.state.topic.reply_count}回复`}
          />
          <List>
            {this.state.topic.replies.map(reply => <div key={reply.id}>
              <ListItem
                children={
                  <ItemBox key={reply.id}>
                    <Flex>
                    <Link to={`/user/${reply.author.loginname}`}>
                    <Avatar alt={reply.author.loginname} src={reply.author.avatar_url} />
                    </Link>
                    <ReplyAuthor>{reply.author.loginname} {timeagoFormat(reply.create_at)}
                    </ReplyAuthor>
                    <ActionThumbUp color="rgba(0,0,0,.54)" style={iconStyle}/>
                    <LikeCount>{ reply.ups.length ? reply.ups.length : '' }</LikeCount>
                    </Flex>
                    <ContentBox dangerouslySetInnerHTML={{__html: marked(reply.content)}}></ContentBox>
                  </ItemBox>
                }
              />
              <Divider />
            </div>)}
          </List>
        </Card>
      </div>
    ) : <Title>话题详情加载中...</Title>;
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({getTopic, setError}, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(Show)