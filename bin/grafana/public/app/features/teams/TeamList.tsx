import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import Page from 'app/core/components/Page/Page';
import { DeleteButton } from '@grafana/ui';
import EmptyListCTA from 'app/core/components/EmptyListCTA/EmptyListCTA';
import { NavModel, Team } from 'app/types';
import { loadTeams, deleteTeam, setSearchQuery } from './state/actions';
import { getSearchQuery, getTeams, getTeamsCount } from './state/selectors';
import { getNavModel } from 'app/core/selectors/navModel';
import { FilterInput } from 'app/core/components/FilterInput/FilterInput';

export interface Props {
  navModel: NavModel;
  teams: Team[];
  searchQuery: string;
  teamsCount: number;
  hasFetched: boolean;
  loadTeams: typeof loadTeams;
  deleteTeam: typeof deleteTeam;
  setSearchQuery: typeof setSearchQuery;
}

export class TeamList extends PureComponent<Props, any> {
  componentDidMount() {
    this.fetchTeams();
  }

  async fetchTeams() {
    await this.props.loadTeams();
  }

  deleteTeam = (team: Team) => {
    this.props.deleteTeam(team.id);
  };

  onSearchQueryChange = (value: string) => {
    this.props.setSearchQuery(value);
  };

  renderTeam(team: Team) {
    const teamUrl = `org/teams/edit/${team.id}`;

    return (
      <tr key={team.id}>
        <td className="width-4 text-center link-td">
          <a href={teamUrl}>
            <img className="filter-table__avatar" src={team.avatarUrl} />
          </a>
        </td>
        <td className="link-td">
          <a href={teamUrl}>{team.name}</a>
        </td>
        <td className="link-td">
          <a href={teamUrl}>{team.email}</a>
        </td>
        <td className="link-td">
          <a href={teamUrl}>{team.memberCount}</a>
        </td>
        <td className="text-right">
          <DeleteButton onConfirm={() => this.deleteTeam(team)} />
        </td>
      </tr>
    );
  }

  renderEmptyList() {
    return (
      <div className="page-container page-body">
        <EmptyListCTA
          model={{
            title: "You haven't created any teams yet.",
            buttonIcon: 'fa fa-plus',
            buttonLink: 'org/teams/new',
            buttonTitle: ' New team',
            proTip: 'Assign folder and dashboard permissions to teams instead of users to ease administration.',
            proTipLink: '',
            proTipLinkTitle: '',
            proTipTarget: '_blank',
          }}
        />
      </div>
    );
  }

  renderTeamList() {
    const { teams, searchQuery } = this.props;

    return (
      <>
        <div className="page-action-bar">
          <div className="gf-form gf-form--grow">
            <FilterInput
              labelClassName="gf-form--has-input-icon gf-form--grow"
              inputClassName="gf-form-input"
              placeholder="Search teams"
              value={searchQuery}
              onChange={this.onSearchQueryChange}
            />
          </div>

          <div className="page-action-bar__spacer" />

          <a className="btn btn-primary" href="org/teams/new">
            New team
          </a>
        </div>

        <div className="admin-list-table">
          <table className="filter-table filter-table--hover form-inline">
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th>Email</th>
                <th>Members</th>
                <th style={{ width: '1%' }} />
              </tr>
            </thead>
            <tbody>{teams.map(team => this.renderTeam(team))}</tbody>
          </table>
        </div>
      </>
    );
  }

  renderList() {
    const { teamsCount } = this.props;

    if (teamsCount > 0) {
      return this.renderTeamList();
    } else {
      return this.renderEmptyList();
    }
  }

  render() {
    const { hasFetched, navModel } = this.props;

    return (
      <Page navModel={navModel}>
        <Page.Contents isLoading={!hasFetched}>{hasFetched && this.renderList()}</Page.Contents>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    navModel: getNavModel(state.navIndex, 'teams'),
    teams: getTeams(state.teams),
    searchQuery: getSearchQuery(state.teams),
    teamsCount: getTeamsCount(state.teams),
    hasFetched: state.teams.hasFetched,
  };
}

const mapDispatchToProps = {
  loadTeams,
  deleteTeam,
  setSearchQuery,
};

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamList)
);
