import { camelizeKeys, decamelize } from 'humps';
import { has } from 'lodash';

import knex from '../../../../server/sql/connector';
import { orderedFor } from '../../../../server/sql/helpers';

export default class User {
  async list(args) {
    let { filters, orderBys, offset, limit } = args;

    const queryBuilder = knex
      .select(
        'u.uuid as id',
        'u.created_at',
        'u.updated_at',
        'u.is_active',
        'u.email',
        'p.display_name',
        'p.first_name',
        'p.middle_name',
        'p.last_name',
        'p.title',
        'p.suffix',
        'p.locale',
        'p.language'
      )
      .from('users AS u')
      .leftJoin('user_profile AS p', 'p.user_id', 'u.id');

    // add filter conditions
    if (filters) {
      for (let filter of filters) {
        if (has(filter, 'isActive') && filter.isActive !== null) {
          queryBuilder.where(function() {
            this.where('u.is_active', filter.isActive);
          });
        }

        if (has(filter, 'searchText') && filter.searchText !== '') {
          queryBuilder.where(function() {
            this.where('u.email', 'like', `%${filter.searchText}%`)
              .orWhere('p.display_name', 'like', `%${filter.searchText}%`)
              .orWhere('p.first_name', 'like', `%${filter.searchText}%`)
              .orWhere('p.last_name', 'like', `%${filter.searchText}%`);
          });
        }
      }
    }

    if (offset) {
      queryBuilder.offset(offset);
    }

    if (limit) {
      queryBuilder.limit(limit);
    }

    // add order by
    if (orderBys) {
      for (let orderBy of orderBys) {
        if (orderBy && orderBy.column) {
          let column = orderBy.column;
          let order = 'asc';
          if (orderBy.order) {
            order = orderBy.order;
          }
          queryBuilder.orderBy(decamelize(column), order);
        }
      }
    }

    return camelizeKeys(await queryBuilder);
  }

  async get(id) {
    return camelizeKeys(
      await knex
        .select(
          'u.uuid as id',
          'u.created_at',
          'u.updated_at',
          'u.is_active',
          'u.email',
          'p.display_name',
          'p.first_name',
          'p.middle_name',
          'p.last_name',
          'p.title',
          'p.suffix',
          'p.locale',
          'p.language'
        )
        .from('users AS u')
        .where('u.uuid', '=', id)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
        .first()
    );
  }

  async getOrgsForUserId(userId) {
    let res = await knex
      .select('o.uuid AS id', 'o.name', 'u.uuid AS userId')
      .whereIn('u.uuid', userId)
      .from('users AS u')
      .leftJoin('orgs_users AS ou', 'ou.user_id', 'u.id')
      .leftJoin('orgs AS o', 'o.id', 'ou.org_id');

    return orderedFor(res, userId, 'userId', false);
  }

  async getOrgsForUserIdViaGroups(userId) {
    let res = await knex
      .select('o.uuid AS id', 'o.name', 'u.uuid AS userId')
      .whereIn('u.uuid', userId)
      .from('users AS u')
      .leftJoin('groups_users AS gu', 'gu.user_id', 'u.id')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'gu.group_id')
      .leftJoin('orgs AS o', 'o.id', 'og.group_id');

    return orderedFor(res, userId, 'userId', false);
  }

  async getGroupsForUserId(userId) {
    let res = await knex
      .select('g.uuid AS id', 'g.name', 'u.uuid AS userId')
      .whereIn('u.uuid', userId)
      .from('users AS u')
      .leftJoin('groups_users AS gu', 'gu.user_id', 'u.id')
      .leftJoin('groups AS g', 'gu.group_id', 'g.id');

    return orderedFor(res, userId, 'userId', false);
  }
}
