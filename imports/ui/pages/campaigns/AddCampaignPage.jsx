import React from "react";
import PageHeader from "/imports/ui/components/app/PageHeader.jsx";
import Loading from "/imports/ui/components/utils/Loading.jsx";
import { Alerts } from "/imports/ui/utils/Alerts.js";

import { Form, Grid, Button, Dropdown, Divider } from "semantic-ui-react";

import moment from "moment";

export default class AddCampaignPage extends React.Component {
  constructor(props) {
    super(props);
    console.log("AddCampaignPage init", { props });
    this.state = {
      contexts: [],
      adAccounts: [],
      name: "",
      contextId: "",
      adAccountId: "",
      description: "",
      isLoading: false
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.contexts != this.props.contexts) {
      const contexts = nextProps.contexts.map(c => ({
        key: c._id,
        text: c.name,
        value: c._id
      }));
      this.setState({
        contexts
      });
    }
    if (
      nextProps.adAccounts !== this.props.adAccounts ||
      (nextProps.adAccounts.length && !this.state.adAccounts.length)
    ) {
      const adAccounts = nextProps.adAccounts.map(ac => ({
        key: ac.id,
        text: ac.account_id,
        value: ac.id
      }));
      this.setState({
        adAccounts
      });
    }
  }
  _handleChange = (e, { name, value }) => this.setState({ [name]: value });
  _handleSubmit(e) {
    const { name, description, contextId, adAccountId } = this.state;
    if (name && contextId) {
      this.setState({ isLoading: true });
      Meteor.call(
        "campaigns.create",
        { name, description, contextId, adAccountId },
        (error, data) => {
          this.setState({ isLoading: false });
          if (error) {
            console.log(error);
            Alerts.error(error);
          } else {
            Alerts.success("Campaign was successfully created");
            FlowRouter.go("App.campaignDetail", { campaignId: data.result });
          }
        }
      );
    }
  }
  render() {
    const { loading, currentUser } = this.props;
    const {
      contexts,
      adAccounts,
      name,
      description,
      context,
      isLoading
    } = this.state;
    return (
      <div>
        <PageHeader title="New Campaign" />
        <section className="content">
          {loading ? (
            <Loading />
          ) : (
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Form onSubmit={this._handleSubmit}>
                    <Form.Input
                      label="Name"
                      name="name"
                      onChange={this._handleChange}
                      placeholder="Campaign name"
                    />
                    <Form.Field>
                      <Dropdown
                        placeholder="Select context"
                        selection
                        onChange={this._handleChange}
                        options={contexts}
                        name="contextId"
                        placeholder="Select context"
                      />
                    </Form.Field>
                    <Form.Field>
                      <Dropdown
                        placeholder="Select an ad account"
                        selection
                        onChange={this._handleChange}
                        options={adAccounts}
                        name="adAccountId"
                        placeholder="Select an ad account"
                      />
                    </Form.Field>
                    <Divider />
                    <Button fluid primary type="submit" loading={isLoading}>
                      Submit
                    </Button>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
        </section>
      </div>
    );
  }
}
